package fr.univcotedazur.dining;

import fr.univcotedazur.dining.models.MenuItem;
import fr.univcotedazur.dining.repositories.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class MenuStartUpLogic implements ApplicationRunner {

    @Autowired
    MenuItemRepository menuItemRepository;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        menuItemRepository.save(createMenuItem("Delicious Pizza Regina","pizza",12));
        menuItemRepository.save(createMenuItem("Lasagna al forno","lasagna",16));
        menuItemRepository.save(createMenuItem("Bottled coke (33cl)","coke",3.5));
    }

    private static MenuItem createMenuItem(String fullName, String shortName, double price) {
        MenuItem menuItem = new MenuItem();
        menuItem.setId(UUID.randomUUID());
        menuItem.setFullName(fullName);
        menuItem.setShortName(shortName);
        menuItem.setPrice(price);
        return menuItem;
    }

}
