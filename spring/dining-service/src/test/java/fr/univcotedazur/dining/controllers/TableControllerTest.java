package fr.univcotedazur.dining.controllers;

import fr.univcotedazur.dining.controllers.dto.TableCreationDTO;
import fr.univcotedazur.dining.repositories.TableRepository;
import io.restassured.http.ContentType;
import io.restassured.module.mockmvc.RestAssuredMockMvc;
import org.apache.http.HttpStatus;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import static io.restassured.module.mockmvc.RestAssuredMockMvc.given;
import static io.restassured.module.mockmvc.RestAssuredMockMvc.when;
import static fr.univcotedazur.dining.controllers.TableController.BASE_URI;
import static org.hamcrest.Matchers.*;

@Testcontainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
public class TableControllerTest {

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

    TableCreationDTO table1;

    @BeforeEach
    void setUp() {
        RestAssuredMockMvc.mockMvc(mockMvc);
        table1 = new TableCreationDTO();
        table1.setTableId(124L);
    }

    @BeforeEach // to remove table from the startup logic
    void tearDown() {
        tableRepository.deleteAll();
    }

    @Test
    void createATableShouldReturnCreatedTwiceConflict() {
        given()
                .contentType(ContentType.JSON).body(table1).
                when()
                .post(BASE_URI).
                then()
                .statusCode(HttpStatus.SC_CREATED)
                .body("number", is(124)) // Rest Assured parsed back an int, not a long
                .body("taken", is(false))
                .body("tableOrderId",is(nullValue()));
        given()
                .contentType(ContentType.JSON).body(table1).
                when()
                .post(BASE_URI)
                .then()
                .statusCode(HttpStatus.SC_CONFLICT);
    }

    @Test
    void createTwoTables() {
        given()
                .contentType(ContentType.JSON).body(table1).
                when()
                .post(BASE_URI).
                then()
                .statusCode(HttpStatus.SC_CREATED);
        TableCreationDTO table2 = new TableCreationDTO();
        table2.setTableId(125L);
        given()
                .contentType(ContentType.JSON).body(table2).
                when()
                .post(BASE_URI).
                then()
                .statusCode(HttpStatus.SC_CREATED);
        when().
                get(BASE_URI).
                then()
                .statusCode(HttpStatus.SC_OK)
                .assertThat()
                .body("size()", is(2));
    }

}
