package fr.univcotedazur.kitchen;

import fr.univcotedazur.kitchen.models.Post;
import fr.univcotedazur.kitchen.models.Recipe;
import fr.univcotedazur.kitchen.repositories.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Period;
import java.time.temporal.TemporalAmount;
import java.util.List;

@Component
public class KitchenStartUpLogic implements ApplicationRunner {


    @Autowired
    RecipeRepository recipeRepository;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (recipeRepository.findAll().size() == 0) { // in case of container restart, mongodb will be already populated
            /* Starters */
            recipeRepository.save(new Recipe("foie gras",
                    Post.HOT_DISH,
                    List.of("Take a piece of foie gras", "Cook it!"),
                    18));
            recipeRepository.save(new Recipe("soft-boiled egg",
                    Post.HOT_DISH,
                    List.of("Take egg", "Cook it!"),
                    16));
            recipeRepository.save(new Recipe("goat cheese",
                    Post.COLD_DISH,
                    List.of("Take goat cheese", "Cook it!"),
                    15));
            recipeRepository.save(new Recipe("salmon",
                    Post.HOT_DISH,
                    List.of("Take salmon", "Cook it!"),
                    16));
            recipeRepository.save(new Recipe("crab maki",
                    Post.HOT_DISH,
                    List.of("Take crab", "Cook it!"),
                    16));
            recipeRepository.save(new Recipe("burrata",
                    Post.COLD_DISH,
                    List.of("Take burrata", "Take mozzarella", "Put them togther", "Shake", "Ok it\'s finished!"),
                    16));
            /* Main */
            recipeRepository.save(new Recipe("pizza",
                    Post.HOT_DISH,
                    List.of("Stretch pizza dough", "Put toppings on it", "Bake at 350 Celsius degree"),
                    10));
            recipeRepository.save(new Recipe("lasagna",
                    Post.HOT_DISH,
                    List.of("Get the frozen dish", "Oven it at 220 Celsius degree"),
                    8));
            recipeRepository.save(new Recipe("beef burger",
                    Post.HOT_DISH,
                    List.of("Take piece of beef", "Cook it!", "Make the burger", "Don\'t forget fries!!"),
                    19));
            recipeRepository.save(new Recipe("beef chuck",
                    Post.HOT_DISH,
                    List.of("Take piece of beef chuck", "Cook it!", "Don\'t forget fries!!"),
                    24));
            recipeRepository.save(new Recipe("half cooked tuna",
                    Post.HOT_DISH,
                    List.of("Take tuna", "Half-cook it!"),
                    23));
            /* Desserts */
            recipeRepository.save(new Recipe("brownie",
                    Post.COLD_DISH,
                    List.of("Take a piece of brownie", "Oven it quickly", "Put it in a plate", "Add some vanilla ice", "Add some cream"),
                    6));
            recipeRepository.save(new Recipe("chocolate",
                    Post.COLD_DISH,
                    List.of("Put some chocolate ice cream in a plate"),
                    12));
            recipeRepository.save(new Recipe("lemon",
                    Post.COLD_DISH,
                    List.of("Take lemon cream", "Take limoncello sorbet", "Put all in a plate"),
                    12));
            recipeRepository.save(new Recipe("rasp and peaches",
                    Post.COLD_DISH,
                    List.of("Take raspberries", "Take peaches", "That\'s it"),
                    12));
            recipeRepository.save(new Recipe("strawberries",
                    Post.COLD_DISH,
                    List.of("Put some strawberries in a plate", "Add vanilla mascarpone mousse"),
                    12));
            recipeRepository.save(new Recipe("seasonal fruit",
                    Post.COLD_DISH,
                    List.of("Put some seasonal fruit in a bowl"),
                    12));
            recipeRepository.save(new Recipe("tiramisu",
                    Post.COLD_DISH,
                    List.of("Take a prepared tiramisu"),
                    10));
            /* Beverage */
            recipeRepository.save(new Recipe("coke",
                            Post.BAR,
                            List.of("Serve it!"),
                            2));
            recipeRepository.save(new Recipe("ice tea",
                    Post.BAR,
                    List.of("Serve it!"),
                    2));
            recipeRepository.save(new Recipe("bottled water",
                    Post.BAR,
                    List.of("Serve it!"),
                    2));
            recipeRepository.save(new Recipe("sparkling water",
                    Post.BAR,
                    List.of("Serve it!"),
                    2));
            recipeRepository.save(new Recipe("spritz",
                    Post.BAR,
                    List.of("Prosecco: 3cl", "Aperol: 2cl", "A bit of Schweppes Tonic Original", "Shake it!", "Serve it!"),
                    20));
            recipeRepository.save(new Recipe("margarita",
                    Post.BAR,
                    List.of("Serve it!"),
                    2));
            recipeRepository.save(new Recipe("tequila",
                    Post.BAR,
                    List.of("Serve it!"),
                    2));
            recipeRepository.save(new Recipe("mojito",
                    Post.BAR,
                    List.of("Put crushed ice in a glass", "Put some mint leaves", "Cut lemon and put it in the glass",
                            "Add some cane sugar syrup", "Crush the lemon", "Add some crushed ice", "Add the rhum",
                            "Add the sparkling water", "Mix it up!", "Serve it!"),
                    30));
            recipeRepository.save(new Recipe("martini",
                    Post.BAR,
                    List.of("Serve it!"),
                    2));
            recipeRepository.save(new Recipe("lemonade",
                    Post.BAR,
                    List.of("Serve it!"),
                    2));
            recipeRepository.save(new Recipe("apple juice",
                    Post.BAR,
                    List.of("Serve it!"),
                    2));
            recipeRepository.save(new Recipe("café",
                    Post.BAR,
                    List.of("Serve it!"),
                    2));
        }
    }

}
