package fr.univcotedazur.inttest;

import io.restassured.RestAssured;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import org.apache.http.HttpStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.is;
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

}