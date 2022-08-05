package fr.univcotedazur.inttest;

import io.restassured.RestAssured;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import org.apache.http.HttpStatus;
import org.json.JSONObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.util.UUID;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class IntegrationTest {

    RequestSpecification menusSpec;
    RequestSpecification diningSpec;
    final static String TABLES = "/tables";
    final static String ORDERS = "/tableOrders";

    @BeforeEach
    public void configureRestAssured() {
        menusSpec = new RequestSpecBuilder().
                setAccept(ContentType.JSON).setContentType(ContentType.JSON).
                setBaseUri("http://localhost:3000/menus").build();
        diningSpec = new RequestSpecBuilder().
                setAccept(ContentType.JSON).setContentType(ContentType.JSON).
                setBaseUri("http://localhost:3001").build();
    }

    @Test
    public void fullMenuTest() {
        given()
                .spec(menusSpec).
            when().
                get().
                then()
                .statusCode(HttpStatus.SC_OK)
                .assertThat()
                .body("size()", is(3));
    }

    @Test
    public void allTablesTest() {
        given()
                .spec(diningSpec).
                when().
                get(TABLES).
                then()
                .statusCode(HttpStatus.SC_OK)
                .assertThat()
                .body("size()", is(3));
    }

    @Test
    public void theFullOrderingTest() throws Exception {
        JSONObject createTableParams = new JSONObject();
        createTableParams.put("tableId","1");
        createTableParams.put("customersCount", "6");
        UUID orderId =
        given()
                .spec(diningSpec)
                .contentType(ContentType.JSON).body(createTableParams.toString()).
                when()
                .post(ORDERS).
                then()
                .statusCode(HttpStatus.SC_CREATED)
                .body("id", notNullValue())
                .body("tableNumber", is(1))
                .body("customersCount", is(6))
                .body("opened", notNullValue())
                .body("billed", nullValue())
                .extract().jsonPath().getUUID("id");
        JSONObject ordering2pizzas = new JSONObject();
        ordering2pizzas.put("shortName","pizza");
        ordering2pizzas.put("howMany", "2");
        given()
                .spec(diningSpec)
                .contentType(ContentType.JSON).body(ordering2pizzas.toString()).
                when()
                .post(ORDERS + "/" + orderId).
                then()
                .statusCode(HttpStatus.SC_CREATED)
                .body("id", equalTo(orderId.toString()));
        JSONObject ordering3cokes = new JSONObject();
        ordering3cokes.put("shortName","coke");
        ordering3cokes.put("howMany", "3");
        given()
                .spec(diningSpec)
                .contentType(ContentType.JSON).body(ordering3cokes.toString()).
                when()
                .post(ORDERS + "/" + orderId).
                then()
                .statusCode(HttpStatus.SC_CREATED);
        given()
                .spec(diningSpec).
                when()
                .post(ORDERS + "/" + orderId + "/prepare").
                then()
                .statusCode(HttpStatus.SC_OK)
                .body("howManyItemsSentForPreparation",is(5));
        given()
                .spec(diningSpec).
                when()
                .post(ORDERS + "/" + orderId + "/bill").
                then()
                .statusCode(HttpStatus.SC_OK)
                .body("billed",notNullValue());
        given()
                .spec(diningSpec).
                when()
                .post(ORDERS + "/" + orderId + "/bill").
                then()
                .statusCode(HttpStatus.SC_UNPROCESSABLE_ENTITY);
    }

}