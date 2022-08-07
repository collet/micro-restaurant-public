package fr.univcotedazur.inttest;

import fr.univcotedazur.inttest.dto.MenuItemDTO;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import org.apache.http.HttpStatus;
import org.json.JSONObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@SpringBootTest
class IntegrationTest {

    RequestSpecification menusSpec;
    RequestSpecification diningSpec;
    final static String TABLES = "/tables";
    final static String ORDERS = "/tableOrders";
    Map<String,UUID> menuItemDTOMap;

    @BeforeEach
    public void configureRestAssured() {
        menusSpec = new RequestSpecBuilder().
                setAccept(ContentType.JSON).setContentType(ContentType.JSON).
                setBaseUri("http://localhost:3000/menus").build();
        diningSpec = new RequestSpecBuilder().
                setAccept(ContentType.JSON).setContentType(ContentType.JSON).
                setBaseUri("http://localhost:3001").build();
        List<MenuItemDTO> menuItemDTOList =
                given()
                        .spec(menusSpec).
                        when().
                        get().
                        then()
                        .statusCode(HttpStatus.SC_OK)
                        .extract().jsonPath().getList("",MenuItemDTO.class);
        menuItemDTOMap = new HashMap<>();
        for (MenuItemDTO m : menuItemDTOList) {
            menuItemDTOMap.put(m.getShortName(),m.getId());
        }
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
        ordering2pizzas.put("id", menuItemDTOMap.get("pizza").toString());
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
        ordering3cokes.put("id", menuItemDTOMap.get("coke").toString());
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