package fr.univcotedazur.kitchen.components;

import fr.univcotedazur.kitchen.exceptions.ItemAlreadyFinishedToBeCookedException;
import fr.univcotedazur.kitchen.exceptions.ItemAlreadyStartedToBeCookedException;
import fr.univcotedazur.kitchen.exceptions.ItemNotStartedToBeCookedException;
import fr.univcotedazur.kitchen.exceptions.RecipeNotFoundException;
import fr.univcotedazur.kitchen.models.Post;
import fr.univcotedazur.kitchen.models.PreparedItem;
import fr.univcotedazur.kitchen.repositories.PreparedItemRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
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

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;

@Testcontainers
@SpringBootTest
class CookingPostTest {

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
    PreparedItemRepository preparedItemRepository;

    @Autowired
    CookingPost cookingPost;

    @MockBean
    KitchenFacade kitchenFacade; // nothing to do except to have a mock facade (calls are void updates)

    @AfterEach
    void tearDown() {
        preparedItemRepository.deleteAll();
    }

    @Test
    void runsASimpleCookingProcess() throws Exception {
        assertThat(cookingPost.allItemsToStartCookingNow(Post.HOT_DISH).size(),equalTo(0));
        LocalDateTime timestamp = LocalDateTime.now().withNano(0);
        PreparedItem preparedPizza = cookingPost.startCookingProcess("pizza", timestamp.plusSeconds(9));
        assertThat(preparedPizza.getId(), is(notNullValue()));
        assertThat(preparedPizza.getShortName(),equalTo("pizza"));
        assertThat(preparedPizza.getShouldStartAt(),equalTo(timestamp.minusSeconds(1)));
        assertThat(preparedPizza.getStartedAt(), is(nullValue()));
        assertThat(preparedPizza.getFinishedAt(), is(nullValue()));
        assertThat(preparedPizza.getRecipe().getPost(),equalTo(Post.HOT_DISH));
        assertThat(cookingPost.allItemsToStartCookingNow(Post.HOT_DISH).size(),equalTo(1));
        final PreparedItem finalPizza1 = preparedPizza;
        assertThrows(ItemNotStartedToBeCookedException.class, () -> cookingPost.finishCookingItem(finalPizza1));
        preparedPizza = cookingPost.startCookingItem(preparedPizza);
        assertThat(preparedPizza.getStartedAt(), is(notNullValue()));
        assertThat(preparedPizza.getFinishedAt(), is(nullValue()));
        final PreparedItem finalPizza2 = preparedPizza;
        assertThrows(ItemAlreadyStartedToBeCookedException.class, () -> cookingPost.startCookingItem(finalPizza2));
        preparedPizza = cookingPost.finishCookingItem(preparedPizza);
        assertThat(preparedPizza.getStartedAt(), is(notNullValue()));
        assertThat(preparedPizza.getFinishedAt(), is(notNullValue()));
        final PreparedItem finalPizza3 = preparedPizza;
        assertThrows(ItemAlreadyFinishedToBeCookedException.class, () -> cookingPost.finishCookingItem(finalPizza3));
    }

    @Test
    void cannotStartACookingProcessWithABadRecipe() {
        assertThrows(RecipeNotFoundException.class, () ->
                cookingPost.startCookingProcess("pizzu", LocalDateTime.now()));
    }

}