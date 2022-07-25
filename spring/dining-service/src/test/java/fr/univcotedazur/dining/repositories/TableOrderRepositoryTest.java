package fr.univcotedazur.dining.repositories;

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

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;

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

    @BeforeEach
    public void setUp() {
        table1 = new Table();
        table1.setNumber(1L);
        tableRepository.save(table1);
    }

    @AfterEach void tearDown() {
        tableRepository.deleteAll();
    }

    @Test
    public void shouldBeNotEmpty() {
        TableOrder tableOrder = new TableOrder();
        tableOrder.setTable(table1);
        tableOrder.setNumberOfCustomers(3);
        tableOrder.setOpened(LocalDateTime.now());
        TableOrder savedTable = tableOrderRepository.save(tableOrder);
        assertThat(savedTable.getNumberOfCustomers(), equalTo(3));
        assertThat(tableOrderRepository.findAll().size(), equalTo(1));
    }

}