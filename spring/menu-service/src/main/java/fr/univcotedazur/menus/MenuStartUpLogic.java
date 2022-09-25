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
        menuItemRepository.save(createMenuItem("Homemade foie gras terrine","foie gras",18,STARTER,
                new URL("https://cdn.pixabay.com/photo/2016/11/12/15/28/restaurant-1819024_960_720.jpg")));
        menuItemRepository.save(createMenuItem("Soft-boiled egg breaded with breadcrumbs and nuts","soft-boiled egg",16,STARTER,
                new URL("https://cdn.pixabay.com/photo/2019/06/03/22/06/eggs-4250077_960_720.jpg")));
        menuItemRepository.save(createMenuItem("Goat cheese foom from \"Valbonne goat farm\"","goat cheese",15,STARTER,
                new URL("https://cdn.pixabay.com/photo/2016/09/15/19/24/salad-1672505_960_720.jpg")));
        menuItemRepository.save(createMenuItem("Homemade dill salmon gravlax","salmon",16, STARTER,
                new URL("https://cdn.pixabay.com/photo/2014/11/05/15/57/salmon-518032_960_720.jpg")));
        menuItemRepository.save(createMenuItem("Crab maki with fresh mango","crab maki",16,STARTER,
                new URL("https://cdn.pixabay.com/photo/2016/03/05/22/23/asian-1239269_960_720.jpg")));
        menuItemRepository.save(createMenuItem("Burrata Mozzarella","burrata",16,STARTER,
                new URL("https://cdn.pixabay.com/photo/2021/02/08/12/40/burrata-5994616_960_720.jpg")));
        menuItemRepository.save(createMenuItem("Delicious Pizza Regina","pizza",12,MAIN,
                new URL("https://cdn.pixabay.com/photo/2020/02/27/20/13/cake-4885715_1280.jpg")));
        menuItemRepository.save(createMenuItem("Lasagna al forno","lasagna",16,MAIN,
                new URL("https://cdn.pixabay.com/photo/2017/02/15/15/17/meal-2069021_1280.jpg")));
        menuItemRepository.save(createMenuItem("Homemade beef burger","beef burger",19,MAIN,
                new URL("https://cdn.pixabay.com/photo/2022/01/17/19/24/burger-6945571_960_720.jpg")));
        menuItemRepository.save(createMenuItem("Beef chuck cooked 48 hours at low temperature","beef chuck",24, MAIN,
                new URL("https://cdn.pixabay.com/photo/2017/01/23/15/36/eat-2002918_960_720.jpg")));
        menuItemRepository.save(createMenuItem("Half cooked tuna and octopus grilled on the plancha", "half cooked tuna",23, MAIN,
                new URL("https://cdn.pixabay.com/photo/2019/09/20/05/53/tuna-4490877_960_720.jpg")));
        menuItemRepository.save(createMenuItem("Brownie (home made)","brownie",6.5, DESSERT,
                new URL("https://cdn.pixabay.com/photo/2014/11/28/08/03/brownie-548591_1280.jpg")));
        menuItemRepository.save(createMenuItem("Valrhona chocolate declination with salted chocolate ice cream", "chocolate",12, DESSERT,
                new URL("https://cdn.pixabay.com/photo/2020/07/31/11/53/ice-cream-5452794_960_720.jpg")));
        menuItemRepository.save(createMenuItem("Marmalade of Menton\'s lemon - Lemon cream - Limoncello jelly and sorbet - Homemade meringue","lemon",12, DESSERT,
                new URL("https://cdn.pixabay.com/photo/2018/05/01/18/19/eat-3366425_960_720.jpg")));
        menuItemRepository.save(createMenuItem("Fresh raspberries and peaches","rasp and peaches",12, DESSERT,
                new URL("https://cdn.pixabay.com/photo/2020/05/15/17/28/fruit-plate-5174414_960_720.jpg")));
        menuItemRepository.save(createMenuItem("Dessert of fresh strawberries and vanilla mascarpone mousse","strawberries",12, DESSERT,
                new URL("https://cdn.pixabay.com/photo/2018/04/09/18/20/strawberry-3304967_960_720.jpg")));
        menuItemRepository.save(createMenuItem("Fresh seasonal fruit","seasonal fruit",12, DESSERT,
                new URL("https://cdn.pixabay.com/photo/2016/08/09/19/03/fruit-1581400_960_720.jpg")));
        menuItemRepository.save(createMenuItem("Speculoos tiramisu","tiramisu",10, DESSERT,
                new URL("https://cdn.pixabay.com/photo/2017/03/19/18/22/italian-food-2157246_960_720.jpg")));
        menuItemRepository.save(createMenuItem("Bottled coke (33cl)","coke",3.5,BEVERAGE,
                new URL("https://cdn.pixabay.com/photo/2019/11/14/15/47/coke-4626458_1280.jpg")));
        menuItemRepository.save(createMenuItem("Ice Tea (33cl)","ice tea",3.5, BEVERAGE,
                new URL("https://cdn.pixabay.com/photo/2022/04/11/08/52/iced-tea-7125271_960_720.jpg")));
        menuItemRepository.save(createMenuItem("Bottled water","bottled water",1, BEVERAGE,
                new URL("https://cdn.pixabay.com/photo/2014/12/11/09/49/water-564048_960_720.jpg")));
        menuItemRepository.save(createMenuItem("Sparkling water","sparkling water",1.5, BEVERAGE,
                new URL("https://cdn.pixabay.com/photo/2018/10/23/19/39/water-3768773_960_720.jpg")));
        menuItemRepository.save(createMenuItem("Spritz","spritz",5, BEVERAGE,
                new URL("https://cdn.pixabay.com/photo/2020/05/12/21/17/spritz-5164971_960_720.jpg")));
        menuItemRepository.save(createMenuItem("Margarita","margarita",6.5, BEVERAGE,
                new URL("https://cdn.pixabay.com/photo/2014/08/11/08/37/margarita-415360_960_720.jpg")));
        menuItemRepository.save(createMenuItem("Tequila sunrise","tequila",7, BEVERAGE,
                new URL("https://cdn.pixabay.com/photo/2018/01/25/19/33/summer-3106910_960_720.jpg")));
        menuItemRepository.save(createMenuItem("Mojito","mojito",6, BEVERAGE,
                new URL("https://cdn.pixabay.com/photo/2015/03/30/12/35/mojito-698499_960_720.jpg")));
        menuItemRepository.save(createMenuItem("Martini","martini",7, BEVERAGE,
                new URL("https://cdn.pixabay.com/photo/2015/10/19/07/50/cocktail-995574_960_720.jpg")));
        menuItemRepository.save(createMenuItem("Lemonade","lemonade",3, BEVERAGE,
                new URL("https://cdn.pixabay.com/photo/2016/07/21/11/17/drink-1532300_960_720.jpg")));
        menuItemRepository.save(createMenuItem("Apple juice","apple juice",3, BEVERAGE,
                new URL("https://cdn.pixabay.com/photo/2016/11/28/22/07/punch-1866178_960_720.jpg")));
        menuItemRepository.save(createMenuItem("Café","café",1.8, BEVERAGE,
                new URL("https://cdn.pixabay.com/photo/2014/12/11/02/56/coffee-563797_960_720.jpg")));
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
