package fr.univcotedazur.menus;

import fr.univcotedazur.menus.models.Category;
import fr.univcotedazur.menus.models.MenuItem;
import fr.univcotedazur.menus.repositories.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.UUID;

import static fr.univcotedazur.menus.models.Category.*;

@Component
public class MenuStartUpLogic implements ApplicationRunner {

    @Autowired
    MenuItemRepository menuItemRepository;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        menuItemRepository.save(createMenuItem("Delicious Pizza Regina","pizza",12,STARTER));
        menuItemRepository.save(createMenuItem("Lasagna al forno","lasagna",16,MAIN));
        menuItemRepository.save(createMenuItem("Bottled coke (33cl)","coke",3.5,BEVERAGE));
        menuItemRepository.save(createMenuItem("Brownie (home made)","brownie",6.5,DESSERT));
    }

    private static MenuItem createMenuItem(String fullName, String shortName, double price, Category category) {
        MenuItem menuItem = new MenuItem();
        menuItem.setId(UUID.randomUUID());
        menuItem.setFullName(fullName);
        menuItem.setShortName(shortName);
        menuItem.setPrice(price);
        menuItem.setCategory(category);
        return menuItem;
    }

}
