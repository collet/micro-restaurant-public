package fr.univcotedazur.kitchen.repositories;

import fr.univcotedazur.kitchen.models.CookedItem;
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
import java.util.UUID;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

@Testcontainers
@SpringBootTest
class CookedItemRepositoryTest {

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
    CookedItemRepository cookedItemRepository;

    @Autowired
    RecipeRepository recipeRepository;

    CookedItem cookedItem;

    @BeforeEach
    public void setup() throws Exception {
        cookedItemRepository.deleteAll();
        cookedItem = new CookedItem();
        cookedItem.setId(UUID.randomUUID());
        cookedItem.setCookableRecipe(recipeRepository.findById("pizza").get());
        cookedItem.setPreparationStarted(LocalDateTime.now());
    }

    @Test
    public void shouldBeNotEmpty() {
        CookedItem savedPizza = cookedItemRepository.save(cookedItem);
        assertThat(cookedItemRepository.findAll().size(), equalTo(1));
        assertThat(savedPizza.getId(), notNullValue());
        assertThat(savedPizza.getCookableRecipe().getShortName(),equalTo("pizza"));
        assertThat(savedPizza.getPreparationStarted(),notNullValue());
    }

    @Test
    public void shouldBeReadyNotServeOnTime() throws Exception {
        cookedItem.setReadyToServe(LocalDateTime.now().plusSeconds(300));
        CookedItem savedPizza = cookedItemRepository.save(cookedItem);
        assertThat(savedPizza.getReadyToServe(),notNullValue());
        List<CookedItem> readys = cookedItemRepository.findReadyToBeServedCookedItems(LocalDateTime.now());
        assertThat(readys.size(),is(0));
        readys = cookedItemRepository.findReadyToBeServedCookedItems(LocalDateTime.now().plusSeconds(300));
        assertThat(readys.size(),is(1));
        savedPizza = readys.get(0);
        savedPizza.setTakenForService(LocalDateTime.now());
        cookedItemRepository.save(savedPizza);
        readys = cookedItemRepository.findReadyToBeServedCookedItems(LocalDateTime.now().plusSeconds(300));
        assertThat(readys.size(),is(0));
    }

}
