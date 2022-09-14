package fr.univcotedazur.dining.components;

import fr.univcotedazur.dining.models.Preparation;
import fr.univcotedazur.dining.exceptions.TableAlreadyTakenException;
import fr.univcotedazur.dining.exceptions.TableOrderAlreadyBilledException;
import fr.univcotedazur.dining.models.*;
import fr.univcotedazur.dining.repositories.TableOrderRepository;
import fr.univcotedazur.dining.repositories.TableRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@Testcontainers
@SpringBootTest
class DiningRoomTest {

    @Container
    static MongoDBContainer mongoDBContainer = new MongoDBContainer(DockerImageName.parse("mongo:4.4.15"))
            .withReuse(true);

    @DynamicPropertySource
    static void mongoDbProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongoDBContainer::getReplicaSetUrl);
    }

    @BeforeAll
    static void initAll() {
        mongoDBContainer.start();
    }

    @Autowired
    TableRepository tableRepository;

    @Autowired
    TableOrderRepository tableOrderRepository;

    @Autowired
    DiningRoom diningRoom;

    @MockBean
    KitchenProxy mockedKitchenProxy;

    Long table1nb = 124L;
    Table table1;
    OrderingItem pizza;
    OrderingItem lasagna;
    OrderingItem coke;
    TableOrder order1;

    @BeforeEach
    public void setUp() throws Exception {
        table1 = new Table();
        table1.setNumber(table1nb);
        pizza = new OrderingItem();
        pizza.setShortName("pizza");
        lasagna = new OrderingItem();
        lasagna.setShortName("lasagna");
        coke = new OrderingItem();
        coke.setShortName("coke");
        order1 = diningRoom.startOrderingOnTable(table1,3);
        CookedItem fakeCookedItem = new CookedItem();
        fakeCookedItem.setId(UUID.randomUUID());
        Preparation firstPreparation = new Preparation();
        firstPreparation.setShouldBeReadyAt(LocalDateTime.now());
        firstPreparation.setPreparedItems(List.of(fakeCookedItem,fakeCookedItem));
        Preparation secondPreparation = new Preparation();
        secondPreparation.setShouldBeReadyAt(LocalDateTime.now());
        secondPreparation.setPreparedItems(List.of(fakeCookedItem,fakeCookedItem,fakeCookedItem));
        when(mockedKitchenProxy.sendCookingOrderToKitchen(anyList(),anyLong())).
                thenReturn(List.of(firstPreparation,secondPreparation)).
                thenReturn(List.of(firstPreparation));
    }

    @AfterEach void tearDown() {
        tableRepository.deleteAll();
        tableOrderRepository.deleteAll();
    }

    @Test
    void startOrderingOnOpenTable() throws Exception {
        assertThat(order1.getCustomersCount(), equalTo(3));
        assertThat(order1.getTableNumber(), equalTo(table1nb));
        TableOrder currentOrder = diningRoom.currentTableOrderOnTable(table1);
        assertThat(currentOrder,equalTo(order1));
    }

    @Test
    void cannotStartOrderingOnTakenTable() throws Exception  {
        assertThrows(TableAlreadyTakenException.class, () -> diningRoom.startOrderingOnTable(table1,5));
    }

    @Test
    void addNewItemOnTableOrder() throws Exception {
        TableOrder modifiedOrder = diningRoom.addNewItemOnTableOrder(order1,pizza,2);
        TableOrder foundOrder = diningRoom.currentTableOrderOnTable(table1);
        assertThat(modifiedOrder,equalTo(foundOrder));
        assertThat(foundOrder.getLines().size(),equalTo(1));
        OrderingLine createdLine = foundOrder.getLines().get(0);
        assertThat(createdLine.getItem(),equalTo(pizza));
        assertThat(createdLine.getHowMany(),equalTo(2));
    }

    @Test
    void cannotAddNewItemOnOrderAlreadyBilled() throws Exception {
        diningRoom.billOrderOnTable(order1);
        assertThrows(TableOrderAlreadyBilledException.class, () -> diningRoom.addNewItemOnTableOrder(order1,pizza,1));
    }

    @Test
    void sendItemsForPreparation() throws Exception {
        diningRoom.addNewItemOnTableOrder(order1,pizza,2);
        diningRoom.addNewItemOnTableOrder(order1,coke,3);
        TableOrder foundOrder = diningRoom.currentTableOrderOnTable(table1);
        List<Preparation> receivedPreparations = diningRoom.sendItemsForPreparation(foundOrder);
        assertThat(receivedPreparations.size(),equalTo(2));
        assertThat(receivedPreparations.stream().flatMap(prep -> prep.getPreparedItems().stream()).toList().size(),equalTo(5));
        foundOrder = diningRoom.currentTableOrderOnTable(table1);
        assertThat(foundOrder.getLines().stream().allMatch(line -> line.isSentForPreparation()), equalTo(true));
        TableOrder returnedOrder = diningRoom.addNewItemOnTableOrder(foundOrder,lasagna,2);
        receivedPreparations = diningRoom.sendItemsForPreparation(returnedOrder);
        assertThat(receivedPreparations.size(),equalTo(1));
        assertThat(receivedPreparations.stream().flatMap(prep -> prep.getPreparedItems().stream()).toList().size(),equalTo(2));
    }

    @Test
    void billOrderOnTableOrder() throws Exception {
        TableOrder returnedOrder = diningRoom.addNewItemOnTableOrder(order1,pizza,4);
        diningRoom.sendItemsForPreparation(returnedOrder);
        Table tableBeforeBilling = tableRepository.findByNumber(returnedOrder.getTableNumber()).get();
        assertThat(tableBeforeBilling.isTaken(), is(true));
        returnedOrder = diningRoom.billOrderOnTable(returnedOrder);
        assertNotNull(returnedOrder.getBilled());
        assertThat(returnedOrder.getLines().get(0).isSentForPreparation(),equalTo(true));
        Table tableAfterBilling = tableRepository.findByNumber(returnedOrder.getTableNumber()).get();
        assertThat(tableAfterBilling.isTaken(), is(false));
    }

    @Test
    void cannotBillOrderOnTableOrderTwice() throws Exception {
        TableOrder returnedOrder = diningRoom.addNewItemOnTableOrder(order1,pizza,2);
        diningRoom.sendItemsForPreparation(returnedOrder);
        final TableOrder billedOrder = diningRoom.billOrderOnTable(returnedOrder);
        assertThrows(TableOrderAlreadyBilledException.class, () -> diningRoom.billOrderOnTable(billedOrder));
    }

}