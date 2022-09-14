package fr.univcotedazur.kitchen.controllers;

import com.fasterxml.jackson.annotation.JsonView;
import fr.univcotedazur.kitchen.components.CookingPost;
import fr.univcotedazur.kitchen.exceptions.ItemAlreadyFinishedToBeCookedException;
import fr.univcotedazur.kitchen.exceptions.ItemAlreadyStartedToBeCookedException;
import fr.univcotedazur.kitchen.exceptions.ItemNotStartedToBeCookedException;
import fr.univcotedazur.kitchen.exceptions.PreparedItemIdNotFoundException;
import fr.univcotedazur.kitchen.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping(path = fr.univcotedazur.kitchen.controllers.CookingController.BASE_URI, produces = APPLICATION_JSON_VALUE)
public class CookingController {

        public static final String BASE_URI = "/preparedItems";

        @Autowired
        CookingPost cookingPost;

        @GetMapping("/{preparedItemId}")
        @JsonView(Views.Internal.class)
        public ResponseEntity<PreparedItem> findPreparedItemById(@PathVariable("preparedItemId") UUID preparedItemId)
                throws PreparedItemIdNotFoundException {
                return ResponseEntity.ok(cookingPost.retrievePreparedItem(preparedItemId));
        }

        @GetMapping("/{preparedItemId}/recipe")
        public ResponseEntity<Recipe> findRecipeByPreparedItemId(@PathVariable("preparedItemId") UUID preparedItemId)
                throws PreparedItemIdNotFoundException {
                return ResponseEntity.ok(cookingPost.retrievePreparedItem(preparedItemId).getRecipe());
        }

        @GetMapping()
        @JsonView(Views.Internal.class)
        public ResponseEntity<List<PreparedItem>> getPreparatedItemsToStartByPost(@RequestParam("post") String postName)
                throws IllegalArgumentException {
                return ResponseEntity.ok(cookingPost.allItemsToStartCookingNow(Post.valueOf(postName)));
        }

        @PostMapping("/{preparedItemId}/start")
        @JsonView(Views.Internal.class)
        public ResponseEntity<PreparedItem> startToPrepareItemOnPost(@PathVariable("preparedItemId") UUID preparedItemId)
                throws PreparedItemIdNotFoundException, ItemAlreadyStartedToBeCookedException {
                return ResponseEntity.ok(cookingPost.startCookingItem(cookingPost.retrievePreparedItem(preparedItemId)));
        }

        @PostMapping("/{preparedItemId}/finish")
        @JsonView(Views.Public.class)
        public ResponseEntity<PreparedItem> finishToPrepareItemOnPost(@PathVariable("preparedItemId") UUID preparedItemId)
                throws PreparedItemIdNotFoundException, ItemAlreadyFinishedToBeCookedException, ItemNotStartedToBeCookedException {
                return ResponseEntity.ok(cookingPost.finishCookingItem(cookingPost.retrievePreparedItem(preparedItemId)));
        }

}
