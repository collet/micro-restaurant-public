package fr.univcotedazur.dining.components;

import fr.univcotedazur.dining.exceptions.AlreadyExistingTableException;
import fr.univcotedazur.dining.exceptions.TableAlreadyTakenException;
import fr.univcotedazur.dining.exceptions.TableOrderAlreadyBilled;
import fr.univcotedazur.dining.models.OrderingItem;
import fr.univcotedazur.dining.models.OrderingLine;
import fr.univcotedazur.dining.models.Table;
import fr.univcotedazur.dining.models.TableOrder;
import fr.univcotedazur.dining.repositories.TableOrderRepository;
import fr.univcotedazur.dining.repositories.TableRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import java.time.LocalDateTime;
import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.junit.jupiter.api.Assertions.*;

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

    Long table1nb = 1L;
    Table table1;
    OrderingItem pizza;
    OrderingItem lasagna;
    OrderingItem coke;
    TableOrder order1;

    @BeforeEach
    public void setUp() throws Exception {
        table1 = new Table();
        table1.setNumber(table1nb);
        tableRepository.save(table1);
        pizza = new OrderingItem();
        pizza.setShortName("pizza");
        lasagna = new OrderingItem();
        lasagna.setShortName("lasagna");
        coke = new OrderingItem();
        coke.setShortName("coke");
        order1 = diningRoom.startOrderingOnTable(table1,3);
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
        assertThrows(TableOrderAlreadyBilled.class, () -> diningRoom.addNewItemOnTableOrder(order1,pizza,1));
    }

    @Test
    void sendItemsForPreparation() throws Exception {
        diningRoom.addNewItemOnTableOrder(order1,pizza,2);
        diningRoom.addNewItemOnTableOrder(order1,coke,2);
        TableOrder foundOrder = diningRoom.currentTableOrderOnTable(table1);
        int sentCount = diningRoom.sendItemsForPreparation(foundOrder);
        assertThat(sentCount,equalTo(4));
        foundOrder = diningRoom.currentTableOrderOnTable(table1);
        List<OrderingLine> sentLines = foundOrder.getLines();
        for (OrderingLine line : sentLines) {
            assertThat(line.isSentForPreparation(),equalTo(true));
        }
        TableOrder returnedOrder = diningRoom.addNewItemOnTableOrder(foundOrder,lasagna,1);
        assertThat(diningRoom.sendItemsForPreparation(returnedOrder),equalTo(1));
    }

    @Test
    void billOrderOnTable() throws Exception {
        TableOrder returnedOrder = diningRoom.addNewItemOnTableOrder(order1,pizza,2);
        diningRoom.sendItemsForPreparation(returnedOrder);
        returnedOrder = diningRoom.billOrderOnTable(returnedOrder);
        assertNotNull(returnedOrder.getBilled());
        assertThat(returnedOrder.getLines().get(0).isSentForPreparation(),equalTo(true));
    }

    @Test
    void cannotBillOrderOnTableTwice() throws Exception {
        TableOrder returnedOrder = diningRoom.addNewItemOnTableOrder(order1,pizza,2);
        diningRoom.sendItemsForPreparation(returnedOrder);
        final TableOrder billedOrder = diningRoom.billOrderOnTable(returnedOrder);
        assertThrows(TableOrderAlreadyBilled.class, () -> diningRoom.billOrderOnTable(billedOrder));
    }

}