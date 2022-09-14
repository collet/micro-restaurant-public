package fr.univcotedazur.kitchen.components;

import fr.univcotedazur.kitchen.models.ItemsToBeCooked;
import fr.univcotedazur.kitchen.models.Post;
import fr.univcotedazur.kitchen.models.Preparation;
import fr.univcotedazur.kitchen.models.PreparedItem;
import fr.univcotedazur.kitchen.repositories.PreparationRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
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

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;

@Testcontainers
@SpringBootTest
class KitchenFacadeTest {

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
    KitchenFacade kitchenFacade;

    @Autowired
    CookingPost cookingPost;

    @Autowired
    PreparationRepository preparationRepository;

    ItemsToBeCooked threePizzas;
    ItemsToBeCooked twoCokes;

    @BeforeEach
    void setUp() {
        threePizzas = new ItemsToBeCooked();
        threePizzas.setShortName("pizza");
        threePizzas.setHowMany(3);
        twoCokes = new ItemsToBeCooked();
        twoCokes.setShortName("coke");
        twoCokes.setHowMany(2);
    }

    @AfterEach
    void tearDown() {
        preparationRepository.deleteAll();
    }

    @Test
    void receiveSimplePreparationRequest() throws Exception {
        List<Preparation> preparationList = kitchenFacade.receivePreparationRequest(1L,
                List.of(threePizzas));
        assertThat(preparationList.size(),equalTo(1));
        assertThat(preparationList.get(0).getPreparedItems().size(),equalTo(3));
    }

    @Test
    void receiveDoublePreparationRequest() throws Exception {
        List<Preparation> preparationList = kitchenFacade.receivePreparationRequest(1L,
                List.of(threePizzas,twoCokes));
        assertThat(preparationList.size(),equalTo(2));
        assertThat(preparationList.stream().flatMap(preparation -> preparation.getPreparedItems().stream()).count(),
                equalTo(5L));
        assertThat(kitchenFacade.allPreparationsNotReady().size(),equalTo(2));
        assertThat(kitchenFacade.allPreparationsNotReadyForTable(1L).size(),equalTo(2));
        assertThat(kitchenFacade.allPreparationsNotReadyForTable(2L).size(),equalTo(0));
        assertThat(kitchenFacade.allPreparationsReady().size(),equalTo(0));
        assertThat(kitchenFacade.allPreparationsReadyForTable(1L).size(),equalTo(0));

        List<PreparedItem> barItemList = cookingPost.allItemsToStartCookingNow(Post.BAR);
        assertThat(barItemList.size(),equalTo(2));
        for (PreparedItem preparedItem : barItemList) {
            cookingPost.startCookingItem(preparedItem);
        }
        assertThat(kitchenFacade.allPreparationsNotReady().size(),equalTo(2));
        assertThat(kitchenFacade.allPreparationsNotReadyForTable(1L).size(),equalTo(2));
        assertThat(kitchenFacade.allPreparationsReady().size(),equalTo(0));
        assertThat(kitchenFacade.allPreparationsReadyForTable(1L).size(),equalTo(0));

        for (PreparedItem preparedItem : barItemList) {
            cookingPost.finishCookingItem(preparedItem);
        }
        assertThat(kitchenFacade.allPreparationsNotReady().size(),equalTo(1));
        assertThat(kitchenFacade.allPreparationsNotReadyForTable(1L).size(),equalTo(1));
        assertThat(kitchenFacade.allPreparationsReady().size(),equalTo(1));
        assertThat(kitchenFacade.allPreparationsReadyForTable(1L).size(),equalTo(1));

        Preparation readyBarPreparation = kitchenFacade.allPreparationsReady().get(0);
        assertThat(readyBarPreparation.getTakenForServiceAt(),is(nullValue()));
        assertThat(kitchenFacade.takeReadyPreparation(readyBarPreparation).getTakenForServiceAt(),is(notNullValue()));
    }

}