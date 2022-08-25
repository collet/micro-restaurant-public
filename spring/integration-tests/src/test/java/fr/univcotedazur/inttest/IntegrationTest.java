package fr.univcotedazur.inttest;

import fr.univcotedazur.inttest.dto.CookedItemDTO;
import fr.univcotedazur.inttest.dto.MenuItemDTO;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import org.apache.http.HttpStatus;
import org.json.JSONObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static org.hamcrest.MatcherAssert.*;

@SpringBootTest
class IntegrationTest {

    RequestSpecification menusSpec;
    RequestSpecification diningSpec;
    RequestSpecification kitchenSpec;
    final static String MENUS = "/menus";
    final static String TABLES = "/tables";
    final static String ORDERS = "/tableOrders";
    final static String KITCHEN = "/cookedItems";
    Map<String,UUID> menuItemDTOMap;

    @Value("${menu.route:}")
    private String menuRoute;

    @Value("${dining.route:}")
    private String diningRoute;

    @Value("${kitchen.route:}")
    private String kitchenRoute;

    @BeforeEach
    public void configureRestAssured() {
        menusSpec = new RequestSpecBuilder().
                setAccept(ContentType.JSON).setContentType(ContentType.JSON).
                setBaseUri(menuRoute + MENUS).build();
        diningSpec = new RequestSpecBuilder().
                setAccept(ContentType.JSON).setContentType(ContentType.JSON).
                setBaseUri(diningRoute).build();
        kitchenSpec = new RequestSpecBuilder().
                setAccept(ContentType.JSON).setContentType(ContentType.JSON).
                setBaseUri(kitchenRoute).build();
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
        given()
                .spec(diningSpec).
                when().
                get(TABLES + "/1").
                then()
                .statusCode(HttpStatus.SC_OK)
                .assertThat()
                .body("taken", is(false));
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
        given()
                .spec(diningSpec).
                when().
                get(TABLES + "/1").
                then()
                .statusCode(HttpStatus.SC_OK)
                .assertThat()
                .body("taken", is(true));
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
        List<CookedItemDTO> cookedItemDTOs =
                given()
                .spec(diningSpec).
                when()
                .post(ORDERS + "/" + orderId + "/prepare").
                then()
                .statusCode(HttpStatus.SC_CREATED)
                .extract().jsonPath().getList("",CookedItemDTO.class);
        assertThat(cookedItemDTOs.size(),equalTo(5));
        List<CookedItemDTO> underPreparationCookedItemDTOs =
        given()
                .spec(kitchenSpec).
                when()
                .get(KITCHEN + "?state=preparationStarted").
                then()
                .statusCode(HttpStatus.SC_OK)
                .extract().jsonPath().getList("",CookedItemDTO.class);
        assertThat(underPreparationCookedItemDTOs.size(),equalTo(5));
        List<CookedItemDTO> readyCookedItemDTOs =
        given()
                .spec(kitchenSpec).
                when()
                .get(KITCHEN + "?state=readyToBeServed").
                then()
                .statusCode(HttpStatus.SC_OK)
                .extract().jsonPath().getList("",CookedItemDTO.class);
        assertThat(readyCookedItemDTOs.size(),equalTo(0));
        Thread.sleep(2000);
        List<CookedItemDTO> servingCookedItemDTOs =
                given()
                        .spec(kitchenSpec).
                        when()
                        .get(KITCHEN + "?state=readyToBeServed").
                        then()
                        .statusCode(HttpStatus.SC_OK)
                        .extract().jsonPath().getList("",CookedItemDTO.class);
        assertThat(servingCookedItemDTOs.size(),equalTo(5));
        for (CookedItemDTO cookedItemDTO : servingCookedItemDTOs) {
            given()
                    .spec(kitchenSpec).
                    when()
                    .post(KITCHEN + "/" + cookedItemDTO.getId() + "/takenToTable" ).
                    then()
                    .statusCode(HttpStatus.SC_OK);
        }
        given()
                .spec(diningSpec).
                when()
                .post(ORDERS + "/" + orderId + "/bill").
                then()
                .statusCode(HttpStatus.SC_OK)
                .body("billed",notNullValue());
        given()
                .spec(diningSpec).
                when().
                get(TABLES + "/1").
                then()
                .statusCode(HttpStatus.SC_OK)
                .assertThat()
                .body("taken", is(false));
        given()
                .spec(diningSpec).
                when()
                .post(ORDERS + "/" + orderId + "/bill").
                then()
                .statusCode(HttpStatus.SC_UNPROCESSABLE_ENTITY);
    }

}