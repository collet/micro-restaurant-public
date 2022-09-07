package fr.univcotedazur.menus;

import fr.univcotedazur.menus.models.Category;
import fr.univcotedazur.menus.models.MenuItem;
import fr.univcotedazur.menus.repositories.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.net.URL;
import java.util.UUID;

import static fr.univcotedazur.menus.models.Category.*;

@Component
public class MenuStartUpLogic implements ApplicationRunner {

    @Autowired
    MenuItemRepository menuItemRepository;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        menuItemRepository.save(createMenuItem("Delicious Pizza Regina","pizza",12,STARTER,
                new URL("https://cdn.pixabay.com/photo/2020/02/27/20/13/cake-4885715_1280.jpg")));
        menuItemRepository.save(createMenuItem("Lasagna al forno","lasagna",16,MAIN,
                new URL("https://cdn.pixabay.com/photo/2017/02/15/15/17/meal-2069021_1280.jpg")));
        menuItemRepository.save(createMenuItem("Bottled coke (33cl)","coke",3.5,BEVERAGE,
                new URL("https://cdn.pixabay.com/photo/2019/11/14/15/47/coke-4626458_1280.jpg")));
        menuItemRepository.save(createMenuItem("Brownie (home made)","brownie",6.5,DESSERT,
                new URL("https://cdn.pixabay.com/photo/2014/11/28/08/03/brownie-548591_1280.jpg")));
    }

    private static MenuItem createMenuItem(String fullName, String shortName, double price, Category category, URL image) {
        MenuItem menuItem = new MenuItem();
        menuItem.setId(UUID.randomUUID());
        menuItem.setFullName(fullName);
        menuItem.setShortName(shortName);
        menuItem.setPrice(price);
        menuItem.setCategory(category);
        menuItem.setImage(image);
        return menuItem;
    }

}
