package fr.univcotedazur.dining.repositories;

import fr.univcotedazur.dining.models.OrderingItem;
import fr.univcotedazur.dining.models.Table;
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

import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;

@Testcontainers
@SpringBootTest
class TableRepositoryTest {

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

    @BeforeEach // to remove table from the startup logic
    void tearDown() {
        tableRepository.deleteAll();
    }

    @Test
    public void canSupportSeveralTables() {
        Table table1 = new Table();
        table1.setNumber(1L);
        Table newTable1 = tableRepository.save(table1);
        assertThat(newTable1,equalTo(table1));
        Table table2 = new Table();
        table2.setNumber(2L);
        Table newTable2 = tableRepository.save(table2);
        assertThat(newTable2.getNumber(),equalTo(2L));
        Optional<Table> opt1 = tableRepository.findById(1L);
        assertThat(opt1.isPresent(),is(true));
        assertThat(opt1.get().getNumber(),equalTo(1L));
        assertThat(opt1.get(),equalTo(table1));
        assertThat(tableRepository.findByNumber(1L).get(),equalTo(table1));
        assertThat(tableRepository.findByNumber(2L).get(),equalTo(newTable2));
        assertThat(tableRepository.count(),is(2L));
    }

    @Test
    public void canBeTaken() {
        assertThat(tableRepository.findOpenTables().size(),is(0));
        Table table1 = new Table();
        table1.setNumber(1L);
        Table newTable1 = tableRepository.save(table1);
        assertThat(newTable1.isTaken(),is(false));
        assertThat(tableRepository.findOpenTables().size(),is(1));
        newTable1.setTaken(true);
        Table newnewTable1 = tableRepository.save(table1);
        assertThat(newnewTable1.isTaken(),is(true));
        assertThat(tableRepository.findOpenTables().size(),is(0));
    }

}
