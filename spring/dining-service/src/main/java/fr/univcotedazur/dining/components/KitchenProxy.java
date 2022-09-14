package fr.univcotedazur.dining.components;

import fr.univcotedazur.dining.components.dto.PreparationRequestDTO;
import fr.univcotedazur.dining.models.OrderingLine;
import fr.univcotedazur.dining.models.Preparation;
import fr.univcotedazur.dining.components.dto.ItemsToBeCookedInKitchenDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.function.Function;

@Component
public class KitchenProxy {

    @Value("${kitchen.host.baseurl:}")
    private String kitchenHostandPort;

    private final RestTemplate restTemplate = new RestTemplate();

    public List<Preparation> sendCookingOrderToKitchen(List<OrderingLine> orderingLineList, Long tableId) {
        return Arrays.asList(restTemplate.postForEntity(kitchenHostandPort +"/preparations",
                             preparationRequestDTOFactory(orderingLineList,tableId), Preparation[].class).getBody());
    }

    public static PreparationRequestDTO preparationRequestDTOFactory(List<OrderingLine> orderingLineList, Long tableId) {
        PreparationRequestDTO preparationRequestDTO = new PreparationRequestDTO();
        preparationRequestDTO.setTableId(tableId);
        List<ItemsToBeCookedInKitchenDTO> result = orderingLineList.stream().map(
                line -> itemsToBeCookedInKitchenDTOFactory(line)).toList();
        preparationRequestDTO.setItemsToBeCookedList(result);
        return preparationRequestDTO;
    }

    public static ItemsToBeCookedInKitchenDTO itemsToBeCookedInKitchenDTOFactory(OrderingLine orderingLine) {
        ItemsToBeCookedInKitchenDTO itemsToBeCookedInKitchenDTO = new ItemsToBeCookedInKitchenDTO();
        itemsToBeCookedInKitchenDTO.setShortName(orderingLine.getItem().getShortName());
        itemsToBeCookedInKitchenDTO.setHowMany(orderingLine.getHowMany());
        return itemsToBeCookedInKitchenDTO;
    }

}
