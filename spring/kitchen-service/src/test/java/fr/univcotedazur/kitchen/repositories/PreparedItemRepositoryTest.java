package fr.univcotedazur.kitchen.repositories;

import fr.univcotedazur.kitchen.models.Post;
import fr.univcotedazur.kitchen.models.PreparedItem;
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
class PreparedItemRepositoryTest {

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
    RecipeRepository recipeRepository;

    PreparedItem preparedItem;

    @BeforeEach
    public void setup() throws Exception {
        preparedItemRepository.deleteAll();
        preparedItem = new PreparedItem();
        preparedItem.setId(UUID.randomUUID());
        preparedItem.setRecipe(recipeRepository.findById("pizza").get());
        preparedItem.setShouldStartAt(LocalDateTime.now().minusSeconds(10));
    }

    @Test
    public void shouldBeNotEmpty() {
        PreparedItem savedPizza = preparedItemRepository.save(preparedItem);
        assertThat(preparedItemRepository.findAll().size(), equalTo(1));
        assertThat(savedPizza.getId(), notNullValue());
        assertThat(savedPizza.getRecipe().getShortName(),equalTo("pizza"));
        assertThat(savedPizza.getShouldStartAt(),notNullValue());
    }

    @Test
    public void shouldBeOnTheRightPost() throws Exception {
        preparedItemRepository.save(preparedItem);
        assertThat(preparedItemRepository.findPreparedItemsThatShouldStartOnThePost(Post.HOT_DISH.toString(),
                LocalDateTime.now()).size(),equalTo(1));
        assertThat(preparedItemRepository.findPreparedItemsThatShouldStartOnThePost(Post.COLD_DISH.toString(),
                LocalDateTime.now()).size(),equalTo(0));
        assertThat(preparedItemRepository.findPreparedItemsThatShouldStartOnThePost(Post.BAR.toString(),
                LocalDateTime.now()).size(),equalTo(0));
    }

    @Test
    public void startedItemsCanBeRetrieved() throws Exception {
        preparedItem.setStartedAt(LocalDateTime.now());
        preparedItemRepository.save(preparedItem);
        assertThat(preparedItemRepository.findAllPreparedItemsStartedAndNotFinished().size(),equalTo(1));
        assertThat(preparedItemRepository.findPreparedItemsThatShouldStartOnThePost(Post.HOT_DISH.toString(),
                LocalDateTime.now()).size(),equalTo(0));
        assertThat(preparedItemRepository.findAllPreparedItemsFinished().size(),equalTo(0));
    }


    @Test
    public void finishedItemsCanBeRetrieved() throws Exception {
        preparedItem.setStartedAt(LocalDateTime.now());
        preparedItem.setFinishedAt(LocalDateTime.now());
        preparedItemRepository.save(preparedItem);
        assertThat(preparedItemRepository.findAllPreparedItemsStartedAndNotFinished().size(),equalTo(0));
        assertThat(preparedItemRepository.findPreparedItemsThatShouldStartOnThePost(Post.HOT_DISH.toString(),
                LocalDateTime.now()).size(),equalTo(0));
        assertThat(preparedItemRepository.findAllPreparedItemsFinished().size(),equalTo(1));
    }

}
