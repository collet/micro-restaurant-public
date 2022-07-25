package fr.univcotedazur.dining.repositories;

import fr.univcotedazur.dining.models.OrderingItem;
import fr.univcotedazur.dining.repositories.OrderingItemRepository;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;

@Testcontainers
@SpringBootTest
public class OrderingItemRepositoryTest {

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
    OrderingItemRepository orderingItemRepository;

    @Test
    public void shouldBeNotEmpty() {
        OrderingItem pizza = new OrderingItem();
        pizza.setShortName("pizza");
        OrderingItem savedPizza = orderingItemRepository.save(pizza);
        assertThat(orderingItemRepository.findAll().size(), equalTo(1));
        assertThat(savedPizza.getShortName(), equalTo("pizza"));
    }

}

