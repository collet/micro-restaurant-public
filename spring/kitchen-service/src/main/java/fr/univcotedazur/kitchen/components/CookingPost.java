package fr.univcotedazur.kitchen.components;

import fr.univcotedazur.kitchen.exceptions.*;
import fr.univcotedazur.kitchen.models.Post;
import fr.univcotedazur.kitchen.models.PreparedItem;
import fr.univcotedazur.kitchen.models.Recipe;
import fr.univcotedazur.kitchen.repositories.PreparedItemRepository;
import fr.univcotedazur.kitchen.repositories.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class CookingPost {

    @Autowired
    RecipeRepository recipeRepository;

    @Autowired
    PreparedItemRepository preparedItemRepository;

    @Autowired
    @Lazy
    KitchenFacade kitchenFacade;

    public Optional<PreparedItem> findById(UUID preparedItemId) {
        return preparedItemRepository.findById(preparedItemId);
    }

    public PreparedItem retrievePreparedItem(UUID preparedItemId) throws PreparedItemIdNotFoundException {
        Optional<PreparedItem> preparatedItemOpt = findById(preparedItemId);
        if (preparatedItemOpt.isEmpty()) {
            throw new PreparedItemIdNotFoundException(preparedItemId);
        }
        return preparatedItemOpt.get();
    }

    public Optional<Recipe> getRecipeFromItemName(String itemName) {
        return recipeRepository.findById(itemName);
    }

    public PreparedItem startCookingProcess(String itemName, LocalDateTime expectedDeliveryTime) throws RecipeNotFoundException {
        Optional<Recipe> recipeOpt = getRecipeFromItemName(itemName);
        if (recipeOpt.isEmpty()) {
            throw new RecipeNotFoundException(itemName);
        }
        Recipe recipe = recipeOpt.get();
        PreparedItem preparedItem = new PreparedItem();
        preparedItem.setId(UUID.randomUUID());
        preparedItem.setShortName(itemName);
        preparedItem.setRecipe(recipe);
        // start time is set to finish at expectedDeliveryTime
        preparedItem.setShouldStartAt(expectedDeliveryTime.minusSeconds(recipe.getMeanCookingTimeInSec()));
        return preparedItemRepository.save(preparedItem);
    }

    public List<PreparedItem> allItemsToStartCookingNow(Post post) {
        return preparedItemRepository.findPreparedItemsThatShouldStartOnThePost(post.toString(),LocalDateTime.now());
    }

    public PreparedItem startCookingItem(PreparedItem preparedItem) throws ItemAlreadyStartedToBeCookedException {
        if (preparedItem.getStartedAt() != null ) {
            throw new ItemAlreadyStartedToBeCookedException(preparedItem);
        }
        preparedItem.setStartedAt(LocalDateTime.now());
        kitchenFacade.updateOnStartedPreparedItem(preparedItem);
        return preparedItemRepository.save(preparedItem);
    }

    public PreparedItem finishCookingItem(PreparedItem preparedItem) throws ItemNotStartedToBeCookedException, ItemAlreadyFinishedToBeCookedException {
        if (preparedItem.getStartedAt() == null) {
            throw new ItemNotStartedToBeCookedException(preparedItem);
        }
        if (preparedItem.getFinishedAt() != null) {
            throw new ItemAlreadyFinishedToBeCookedException(preparedItem);
        }
        preparedItem.setFinishedAt(LocalDateTime.now());
        kitchenFacade.updateOnFinishedPreparedItem(preparedItem);
        return preparedItemRepository.save(preparedItem);
    }

}
