package fr.univcotedazur.kitchen;

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

    private static final int DEMO_COOKING_TIME_IN_SEC = 2;
    // to facilitate demo, should be a duration of minutes specific to each recipe and even kitchen load

    @Autowired
    RecipeRepository recipeRepository;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (recipeRepository.findAll().size() == 0) { // in case of container restart, mongodb will be already populated
            recipeRepository.save(new Recipe("pizza",
                            List.of("Stretch pizza dough", "Put toppings on it", "Bake at 350 Celsius degree"),
                            DEMO_COOKING_TIME_IN_SEC));
            recipeRepository.save(new Recipe("lasagna",
                            List.of("Get the frozen dish", "Oven it at 220 Celsius degree"),
                            DEMO_COOKING_TIME_IN_SEC));
            recipeRepository.save(new Recipe("coke",
                            List.of("Serve it!"),
                            DEMO_COOKING_TIME_IN_SEC));
        }
    }


}
