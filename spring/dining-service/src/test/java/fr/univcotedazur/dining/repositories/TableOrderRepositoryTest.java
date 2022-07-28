package fr.univcotedazur.dining.repositories;

import fr.univcotedazur.dining.models.OrderingItem;
import fr.univcotedazur.dining.models.OrderingLine;
import fr.univcotedazur.dining.models.Table;
import fr.univcotedazur.dining.models.TableOrder;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
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
import static org.hamcrest.Matchers.*;

@Testcontainers
@SpringBootTest
class TableOrderRepositoryTest {

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

    Table table1;
    OrderingItem pizza;
    OrderingItem lasagna;
    OrderingItem coke;

    @BeforeEach
    public void setUp() {
        table1 = new Table();
        table1.setNumber(1L);
        tableRepository.save(table1);
        pizza = new OrderingItem();
        pizza.setShortName("pizza");
        lasagna = new OrderingItem();
        lasagna.setShortName("lasagna");
        coke = new OrderingItem();
        coke.setShortName("coke");
    }

    @AfterEach void tearDown() {
        tableRepository.deleteAll();
        tableOrderRepository.deleteAll();
    }

    @Test
    public void shouldBeNotEmpty() {
        TableOrder tableOrder = new TableOrder();
        tableOrder.setTable(table1);
        tableOrder.setNumberOfCustomers(3);
        tableOrder.setOpened(LocalDateTime.now());
        TableOrder savedTableOrder = tableOrderRepository.save(tableOrder);
        assertThat(savedTableOrder.getNumberOfCustomers(), equalTo(3));
        assertThat(savedTableOrder.getTable(), equalTo(table1));
        assertThat(tableOrderRepository.findAll().size(), equalTo(1));
    }

    @Test
    public void shouldPassAnOrder() {
        TableOrder tableOrder = new TableOrder();
        tableOrder.setTable(table1);
        tableOrder.setNumberOfCustomers(1);
        tableOrder.setOpened(LocalDateTime.now());
        OrderingLine line1 = new OrderingLine();
        line1.setHowMany(1);
        line1.setItem(pizza);
        OrderingLine line2 = new OrderingLine();
        line2.setHowMany(1);
        line2.setItem(lasagna);
        OrderingLine line3 = new OrderingLine();
        line3.setHowMany(2);
        line3.setItem(coke);
        tableOrder.setLines(List.of(line1,line2,line3));
        TableOrder savedTableOrder = tableOrderRepository.save(tableOrder);
        assertThat(savedTableOrder.getNumberOfCustomers(), equalTo(1));
        assertThat(savedTableOrder.getLines().size(), equalTo(3));

        line1.setSentForPreparation(true);
        tableOrderRepository.save(tableOrder);
        assertThat(tableOrderRepository.findByTable(table1).isPresent(),is(true));

        List<TableOrder> openTableOrders = tableOrderRepository.findOpenTableOrders();
        assertThat(openTableOrders.size(),equalTo(1));
        TableOrder openOrder = openTableOrders.get(0);
        assertThat(openOrder.getLines().stream().filter(line -> ! line.isSentForPreparation() ).count(),equalTo(2L));

    }



}