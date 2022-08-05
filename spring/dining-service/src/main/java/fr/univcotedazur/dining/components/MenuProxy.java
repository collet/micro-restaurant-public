package fr.univcotedazur.dining.components;

import fr.univcotedazur.dining.models.OrderingItem;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Component
public class MenuProxy {

    @Value("${menu.host.baseurl:}")
    private String menuHostandPort;

    private RestTemplate restTemplate = new RestTemplate();

    private Map<String, OrderingItem> menuItemMap;

    public List<OrderingItem> findAll() {
        populateMenuItemMapIfNeeded();
        return new ArrayList<>(menuItemMap.values());
    }

    public Optional<OrderingItem> findByShortName(String shortName) {
        populateMenuItemMapIfNeeded();
        return Optional.ofNullable(menuItemMap.get(shortName));
    }

    private void populateMenuItemMapIfNeeded() {
        System.err.println("###################### acessing menus from the dining service #################");
        if (menuItemMap == null) {
            OrderingItem[] menuItems = restTemplate.getForEntity(menuHostandPort+"/menus", OrderingItem[].class).getBody();
            menuItemMap = new HashMap<>(menuItems.length * 4 / 3);
            for(int i=0; i < menuItems.length; i++) {
                menuItemMap.put(menuItems[i].getShortName(),menuItems[i]);
            }
        }
    }

}
