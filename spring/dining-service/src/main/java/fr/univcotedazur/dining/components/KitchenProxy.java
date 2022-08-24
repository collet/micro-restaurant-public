package fr.univcotedazur.dining.components;

import fr.univcotedazur.dining.models.CookedItem;
import fr.univcotedazur.dining.components.dto.ItemsToBeCookedInKitchen;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Component
public class KitchenProxy {

    @Value("${kitchen.host.baseurl:}")
    private String kitchenHostandPort;

    private RestTemplate restTemplate = new RestTemplate();

    public List<CookedItem> sendCookingOrderToKitchen(ItemsToBeCookedInKitchen itemsToBeCookedInKitchen) {
        return Arrays.asList(restTemplate.postForEntity(kitchenHostandPort +"/cookedItems",
                             itemsToBeCookedInKitchen, CookedItem[].class).getBody());
    }

}
