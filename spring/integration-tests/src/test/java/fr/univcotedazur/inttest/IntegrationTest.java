package fr.univcotedazur.inttest;

import fr.univcotedazur.inttest.dto.*;
import ij.IJ;
import ij.ImagePlus;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import org.apache.http.HttpStatus;
import org.json.JSONObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.NullValueInNestedPathException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.*;

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
    final static String KITCHEN = "/preparations";
    final static String COOKING = "/preparedItems";
    Map<String,MenuItemDTO> menuItemDTOMap;

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
            menuItemDTOMap.put(m.getShortName(),m);
        }
    }

    @Test
    public void fullMenuTest() throws Exception {
        assertThat("30 items are in the menu", menuItemDTOMap.size() ,equalTo(30));
        MenuItemDTO lasagna = menuItemDTOMap.get("lasagna");
        assertThat("lasagna is the menu", lasagna != null);
        assertThat("lasagna has the right price", lasagna.getPrice(), equalTo(16d));
        assertThat("lasagna is in the right category", lasagna.getCategory().equals("MAIN"));
        ImagePlus lasagnaImage = IJ.openImage(lasagna.getImage().toString());
        assertThat("lasagna image can be retrieved", lasagnaImage.getWidth(), equalTo(1280));
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
                .body("taken", is(false))
                .body("tableOrderId",is(nullValue()));
        JSONObject createTableParams = new JSONObject();
        createTableParams.put("tableId","1");
        createTableParams.put("customersCount", "6");
        // create an order
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
        given()
                .spec(diningSpec).
                when().
                get(TABLES + "/1").
                then()
                .statusCode(HttpStatus.SC_OK)
                .assertThat()
                .body("taken", is(true))
                .body("tableOrderId",equalTo(orderId.toString()));
        JSONObject ordering2pizzas = new JSONObject();
        ordering2pizzas.put("shortName","pizza");
        ordering2pizzas.put("id", menuItemDTOMap.get("pizza").getId().toString());
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
        ordering3cokes.put("id", menuItemDTOMap.get("coke").getId().toString());
        ordering3cokes.put("howMany", "3");
        given()
                .spec(diningSpec)
                .contentType(ContentType.JSON).body(ordering3cokes.toString()).
                when()
                .post(ORDERS + "/" + orderId).
                then()
                .statusCode(HttpStatus.SC_CREATED);
        // send order to be prepared in kitchen
        List<DiningPreparationDTO> diningPreparationDTOS =
                given()
                .spec(diningSpec).
                when()
                .post(ORDERS + "/" + orderId + "/prepare").
                then()
                .statusCode(HttpStatus.SC_CREATED)
                .extract().jsonPath().getList("", DiningPreparationDTO.class);
        assertThat(diningPreparationDTOS.size(),equalTo(2));
        assertThat(diningPreparationDTOS.get(0).getId(),is(notNullValue()));
        assertThat(diningPreparationDTOS.get(0).getPreparedItems().size(),greaterThan(0));
        List<DiningCookedItemDTO> diningCookedItemDTOS = diningPreparationDTOS.stream().flatMap(preparation ->
                preparation.getPreparedItems().stream()).toList();
        assertThat(diningCookedItemDTOS.size(),equalTo(5));
        // checking that dining and kitchen visions on preparation are consistent
        List<KitchenPreparationDTO> kitchenPreparationDTOS =
        given()
                .spec(kitchenSpec).
                when()
                .get(KITCHEN + "?state=preparationStarted").
                then()
                .statusCode(HttpStatus.SC_OK)
                .extract().jsonPath().getList("", KitchenPreparationDTO.class);
        assertThat(kitchenPreparationDTOS.size(),equalTo(2));
        List<DiningPreparationDTO> prepDifferences = new ArrayList<>(diningPreparationDTOS);
        prepDifferences.removeIf(diningDTO -> kitchenPreparationDTOS.stream()
                        .anyMatch(kitchenDTO -> kitchenDTO.getId().equals(diningDTO.getId())));
        assertThat(prepDifferences.size(),equalTo(0));
        List<KitchenPreparedItemDTO> kitchenPreparedItemDTOS = kitchenPreparationDTOS.stream().flatMap(preparation ->
                preparation.getPreparedItems().stream()).toList();
        assertThat(kitchenPreparedItemDTOS.size(),equalTo(5));
        List<DiningCookedItemDTO> itemDifferenes = new ArrayList<>(diningCookedItemDTOS);
        itemDifferenes.removeIf(diningItem -> kitchenPreparedItemDTOS.stream()
                 .anyMatch(kitchenItem -> kitchenItem.getId().equals(diningItem.getId())));
        assertThat(itemDifferenes.size(),equalTo(0));
        // check consistency with cooking post
        List<KitchenPreparedItemDTO> barPreparedItemDTOS =
                given()
                        .spec(kitchenSpec).
                        when()
                        .get(COOKING + "?post=BAR").
                        then()
                        .statusCode(HttpStatus.SC_OK)
                        .extract().jsonPath().getList("", KitchenPreparedItemDTO.class);
        assertThat(barPreparedItemDTOS.size(),equalTo(3));
        assertThat(barPreparedItemDTOS.get(0).getStartedAt(),is(nullValue()));
        List<KitchenPreparedItemDTO> hotPreparedItemDTOS =
                given()
                        .spec(kitchenSpec).
                        when()
                        .get(COOKING + "?post=HOT_DISH").
                        then()
                        .statusCode(HttpStatus.SC_OK)
                        .extract().jsonPath().getList("", KitchenPreparedItemDTO.class);
        assertThat(hotPreparedItemDTOS.size(),equalTo(2));
        // start "cooking" in bar
        for(KitchenPreparedItemDTO kitchenPreparedItemDTO : barPreparedItemDTOS) {
            given()
                    .spec(kitchenSpec).
                    when()
                    .post(COOKING + "/" + kitchenPreparedItemDTO.getId() + "/start").
                    then()
                    .statusCode(HttpStatus.SC_OK);
        }
        List<KitchenPreparedItemDTO> emptyBarPreparedItemDTOS =
                given()
                        .spec(kitchenSpec).
                        when()
                        .get(COOKING + "?post=BAR").
                        then()
                        .statusCode(HttpStatus.SC_OK)
                        .extract().jsonPath().getList("", KitchenPreparedItemDTO.class);
        assertThat(emptyBarPreparedItemDTOS.size(),equalTo(0));
        // finish "cooking" at the bar
        for(KitchenPreparedItemDTO kitchenPreparedItemDTO : barPreparedItemDTOS) {
            given()
                    .spec(kitchenSpec).
                    when()
                    .post(COOKING + "/" + kitchenPreparedItemDTO.getId() + "/finish").
                    then()
                    .statusCode(HttpStatus.SC_OK);
        }
        List<KitchenPreparationDTO> readyKitchenPreparationDTOS =
                given()
                        .spec(kitchenSpec).
                        when()
                        .get(KITCHEN + "?state=readyToBeServed").
                        then()
                        .statusCode(HttpStatus.SC_OK)
                        .extract().jsonPath().getList("", KitchenPreparationDTO.class);
        assertThat(readyKitchenPreparationDTOS.size(),equalTo(1));
        assertThat(readyKitchenPreparationDTOS.get(0).getPreparedItems().get(0).getShortName(),equalTo("coke"));
        List<KitchenPreparationDTO> notReadyKitchenPreparationDTOS =
                given()
                        .spec(kitchenSpec).
                        when()
                        .get(KITCHEN + "?state=preparationStarted").
                        then()
                        .statusCode(HttpStatus.SC_OK)
                        .extract().jsonPath().getList("", KitchenPreparationDTO.class);
        assertThat(notReadyKitchenPreparationDTOS.size(),equalTo(1));
        assertThat(notReadyKitchenPreparationDTOS.get(0).getPreparedItems().get(0).getShortName(),equalTo("pizza"));
        // serve the cokes
        KitchenPreparationDTO servedCokes =
                given()
                        .spec(kitchenSpec).
                        when()
                        .post(KITCHEN + "/" + readyKitchenPreparationDTOS.get(0).getId() + "/takenToTable").
                        then()
                        .statusCode(HttpStatus.SC_OK)
                        .extract().as(KitchenPreparationDTO.class);
        assertThat(servedCokes.getTakenForServiceAt(),is(notNullValue()));
        // start/finish cooking pizza
        for(KitchenPreparedItemDTO kitchenPreparedItemDTO : hotPreparedItemDTOS) {
            given()
                    .spec(kitchenSpec).
                    when()
                    .post(COOKING + "/" + kitchenPreparedItemDTO.getId() + "/start").
                    then()
                    .statusCode(HttpStatus.SC_OK);
            given()
                    .spec(kitchenSpec).
                    when()
                    .post(COOKING + "/" + kitchenPreparedItemDTO.getId() + "/finish").
                    then()
                    .statusCode(HttpStatus.SC_OK);
        }
        // check that pizzas are ready at the table level
        List<KitchenPreparationDTO> readyPizzaKitchenPreparationDTOS =
                given()
                        .spec(kitchenSpec).
                        when()
                        .get(KITCHEN + "?state=readyToBeServed"). // ,tableId=1
                        then()
                        .statusCode(HttpStatus.SC_OK)
                        .extract().jsonPath().getList("", KitchenPreparationDTO.class);
        assertThat(readyPizzaKitchenPreparationDTOS.size(),equalTo(1));
        assertThat(readyPizzaKitchenPreparationDTOS.get(0).getPreparedItems().get(0).getShortName(),equalTo("pizza"));
        // take pizzas to the table
        given()
                .spec(kitchenSpec).
                when()
                .post(KITCHEN + "/" + readyPizzaKitchenPreparationDTOS.get(0).getId() + "/takenToTable").
                then()
                .statusCode(HttpStatus.SC_OK);
        // bill
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
                .body("taken", is(false))
                .body("tableOrderId",is(nullValue()));
        given()
                .spec(diningSpec).
                when()
                .post(ORDERS + "/" + orderId + "/bill").
                then()
                .statusCode(HttpStatus.SC_UNPROCESSABLE_ENTITY);
    }

}