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
            recipeRepository.save(new Recipe("pizza",
                            Post.HOT_DISH,
                            List.of("Stretch pizza dough", "Put toppings on it", "Bake at 350 Celsius degree"),
                            3));
            recipeRepository.save(new Recipe("lasagna",
                            Post.HOT_DISH,
                            List.of("Get the frozen dish", "Oven it at 220 Celsius degree"),
                            2));
            recipeRepository.save(new Recipe("coke",
                            Post.BAR,
                            List.of("Serve it!"),
                            1));
        }
    }


}
