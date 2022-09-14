package fr.univcotedazur.dining.controllers;

import fr.univcotedazur.dining.components.KitchenProxy;
import fr.univcotedazur.dining.components.MenuProxy;
import fr.univcotedazur.dining.models.Preparation;
import fr.univcotedazur.dining.controllers.dto.ItemDTO;
import fr.univcotedazur.dining.controllers.dto.StartOrderingDTO;
import fr.univcotedazur.dining.controllers.dto.TableCreationDTO;
import fr.univcotedazur.dining.models.CookedItem;
import fr.univcotedazur.dining.models.OrderingItem;
import fr.univcotedazur.dining.models.OrderingLine;
import fr.univcotedazur.dining.repositories.TableOrderRepository;
import fr.univcotedazur.dining.repositories.TableRepository;
import io.restassured.http.ContentType;
import io.restassured.module.mockmvc.RestAssuredMockMvc;
import org.apache.http.HttpStatus;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static fr.univcotedazur.dining.controllers.DiningController.BASE_URI;
import static io.restassured.module.mockmvc.RestAssuredMockMvc.given;
import static io.restassured.module.mockmvc.RestAssuredMockMvc.when;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

@Testcontainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
public class DiningControllerTest {

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
    private MockMvc mockMvc;

    @Autowired
    private TableRepository tableRepository;

    @Autowired
    private TableOrderRepository tableOrderRepository;

    @MockBean
    private MenuProxy mockedMenuProxy;

    @MockBean
    KitchenProxy mockedKitchenProxy;

    TableCreationDTO table1;
    Long table1Id = 124L;
    StartOrderingDTO order1;
    ItemDTO twoPizzas;
    ItemDTO oneLasagna;
    ItemDTO threeCokes;

    @BeforeEach
    void setUp() {
        RestAssuredMockMvc.mockMvc(mockMvc);
        table1 = new TableCreationDTO();
        table1.setTableId(table1Id);
        given()
                .contentType(ContentType.JSON).body(table1).
                when()
                .post(TableController.BASE_URI).
                then()
                .statusCode(HttpStatus.SC_CREATED);
        order1 = new StartOrderingDTO();
        order1.setTableId(table1Id);
        order1.setCustomersCount(4);
        twoPizzas = new ItemDTO();
        twoPizzas.setShortName("pizza");
        twoPizzas.setId("ID1");
        twoPizzas.setHowMany(2);
        oneLasagna = new ItemDTO();
        oneLasagna.setShortName("lasagna");
        oneLasagna.setId("ID2");
        oneLasagna.setHowMany(1);
        threeCokes = new ItemDTO();
        threeCokes.setShortName("coke");
        threeCokes.setId("ID3");
        threeCokes.setHowMany(3);
        OrderingItem mockPizza = new OrderingItem();
        mockPizza.setShortName(twoPizzas.getShortName());
        mockPizza.setId(twoPizzas.getId());
        OrderingItem mockLasagna = new OrderingItem();
        mockLasagna.setShortName(oneLasagna.getShortName());
        mockLasagna.setId(oneLasagna.getId());
        OrderingItem mockCoke = new OrderingItem();
        mockCoke.setShortName(threeCokes.getShortName());
        mockCoke.setId(threeCokes.getId());
        org.mockito.Mockito.when(mockedMenuProxy.findByShortName(org.mockito.Mockito.anyString())).
                thenReturn(Optional.of(mockPizza)).
                thenReturn(Optional.of(mockCoke)).
                thenReturn(Optional.of(mockLasagna));
        CookedItem fakeCookedItem = new CookedItem();
        fakeCookedItem.setId(UUID.randomUUID());
        Preparation firstPreparation = new Preparation();
        firstPreparation.setPreparedItems(List.of(fakeCookedItem,fakeCookedItem));
        firstPreparation.setShouldBeReadyAt(LocalDateTime.now());
        Preparation secondPreparation = new Preparation();
        secondPreparation.setPreparedItems(List.of(fakeCookedItem,fakeCookedItem,fakeCookedItem));
        secondPreparation.setShouldBeReadyAt(LocalDateTime.now());
        Preparation thirdPreparation = new Preparation();
        thirdPreparation.setPreparedItems(List.of(fakeCookedItem));
        thirdPreparation.setShouldBeReadyAt(LocalDateTime.now());
        org.mockito.Mockito.when(mockedKitchenProxy.sendCookingOrderToKitchen(
                org.mockito.Mockito.anyList(), org.mockito.Mockito.anyLong())).
                thenReturn(List.of(firstPreparation, secondPreparation)).
                thenReturn(List.of(thirdPreparation));
    }


    @AfterEach
    void tearDown() {
        tableRepository.deleteAll();
        tableOrderRepository.deleteAll();
    }

    @Test
    void createTableOrderSuccessfullyTwiceUnProcessable() {
        given()
                .contentType(ContentType.JSON).body(order1).
                when()
                .post(BASE_URI).
                then()
                .statusCode(HttpStatus.SC_CREATED)
                .body("id", notNullValue())
                .body("tableNumber", is(table1Id.intValue()))
                .body("customersCount", is(4))
                .body("opened", notNullValue())
                .body("billed", nullValue());
        given()
                .contentType(ContentType.JSON).body(order1).
                when()
                .post(BASE_URI).
                then()
                .statusCode(HttpStatus.SC_UNPROCESSABLE_ENTITY);
    }

    @Test
    void addToTableOrder() {
        UUID orderId =
                given()
                        .contentType(ContentType.JSON).body(order1).
                        when()
                        .post(BASE_URI).
                        then()
                        .statusCode(HttpStatus.SC_CREATED)
                        .extract().jsonPath().getUUID("id");
        List<OrderingLine> lines =
                given()
                        .contentType(ContentType.JSON).body(twoPizzas).
                        when()
                        .post(BASE_URI + "/" + orderId).
                        then()
                        .statusCode(HttpStatus.SC_CREATED)
                        .body("id", equalTo(orderId.toString()))
                        .extract().response().jsonPath().getList("lines", OrderingLine.class);
        assertThat(lines.size(), is(1));
        OrderingLine line = lines.get(0);
        assertThat(line.getItem().getShortName(), equalTo("pizza"));
        assertThat(line.getHowMany(), is(2));
    }

    @Test
    void sendForPreparation() {
        UUID orderId =
                given()
                        .contentType(ContentType.JSON).body(order1).
                        when()
                        .post(BASE_URI).
                        then()
                        .statusCode(HttpStatus.SC_CREATED)
                        .extract().jsonPath().getUUID("id");
        given()
                .contentType(ContentType.JSON).body(twoPizzas).
                when()
                .post(BASE_URI + "/" + orderId).
                then()
                .statusCode(HttpStatus.SC_CREATED);
        List<OrderingLine> lines =
        given()
                .contentType(ContentType.JSON).body(threeCokes).
                when()
                .post(BASE_URI + "/" + orderId).
                then()
                .statusCode(HttpStatus.SC_CREATED)
                .extract().response().jsonPath().getList("lines", OrderingLine.class);
        assertThat(lines.size(), is(2));
        for (OrderingLine line : lines) {
            assertThat(line.isSentForPreparation(),is(false));
        }
        List<Preparation> preparations =
        when()
                .post(BASE_URI + "/" + orderId + "/prepare").
                then()
                .statusCode(HttpStatus.SC_CREATED)
                .extract().response().jsonPath().getList("",Preparation.class);
        assertThat(preparations.size(),equalTo(2));
        assertThat(preparations.stream().flatMap(prep -> prep.getPreparedItems().stream()).toList().size(),equalTo(5));
        lines =
                when()
                        .get(BASE_URI + "/" + orderId).
                        then()
                        .statusCode(HttpStatus.SC_OK)
                        .extract().response().jsonPath().getList("lines", OrderingLine.class);
        assertThat(lines.stream().allMatch(line -> line.isSentForPreparation()), equalTo(true));
        given()
                .contentType(ContentType.JSON).body(oneLasagna).
                when()
                .post(BASE_URI + "/" + orderId).
                then()
                .statusCode(HttpStatus.SC_CREATED);
        preparations =
                when()
                        .post(BASE_URI + "/" + orderId + "/prepare").
                        then()
                        .statusCode(HttpStatus.SC_CREATED)
                        .extract().response().jsonPath().getList("",Preparation.class);
        assertThat(preparations.size(),equalTo(1));
        assertThat(preparations.stream().flatMap(prep -> prep.getPreparedItems().stream()).toList().size(),equalTo(1));
    }

    @Test
    void billTableTwiceUnprocessableCannotOrderAnymore() {
        UUID orderId =
                given()
                        .contentType(ContentType.JSON).body(order1).
                        when()
                        .post(BASE_URI).
                        then()
                        .statusCode(HttpStatus.SC_CREATED)
                        .extract().jsonPath().getUUID("id");
        given()
                .contentType(ContentType.JSON).body(twoPizzas).
                when()
                .post(BASE_URI + "/" + orderId).
                then()
                .statusCode(HttpStatus.SC_CREATED);
        when()
                .post(BASE_URI + "/" + orderId + "/bill").
                then()
                .statusCode(HttpStatus.SC_OK)
                .body("billed",notNullValue());
        when()
                .post(BASE_URI + "/" + orderId + "/bill").
                then()
                .statusCode(HttpStatus.SC_UNPROCESSABLE_ENTITY);
        given()
                .contentType(ContentType.JSON).body(threeCokes).
                when()
                .post(BASE_URI + "/" + orderId).
                then()
                .statusCode(HttpStatus.SC_UNPROCESSABLE_ENTITY);
    }



}
