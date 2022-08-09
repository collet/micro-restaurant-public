package fr.univcotedazur.kitchen.controllers;

import fr.univcotedazur.kitchen.controllers.dto.CookedItemDTO;
import fr.univcotedazur.kitchen.controllers.dto.ItemsToBeCooked;
import fr.univcotedazur.kitchen.exceptions.*;
import fr.univcotedazur.kitchen.models.CookedItem;
import fr.univcotedazur.kitchen.models.Recipe;
import fr.univcotedazur.kitchen.repositories.CookedItemRepository;
import fr.univcotedazur.kitchen.repositories.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAmount;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping(path = KitchenController.BASE_URI, produces = APPLICATION_JSON_VALUE)
public class KitchenController {

    public static final String BASE_URI = "/kitchen";

    @Autowired
    RecipeRepository recipeRepository;

    @Autowired
    CookedItemRepository cookedItemRepository;

    @PostMapping // Bad Pattern : the controller is doing some business logic (MVP...)
    public ResponseEntity<List<CookedItemDTO>> takeOrder(@RequestBody @Valid ItemsToBeCooked itemsToBeCooked) throws ItemsToBeCookedDTONotFoundException {
        Optional<Recipe> recipeOpt = recipeRepository.findById(itemsToBeCooked.getShortName());
        if (recipeOpt.isEmpty()) {
            throw new ItemsToBeCookedDTONotFoundException(itemsToBeCooked.getShortName());
        } else {
            ArrayList<CookedItemDTO> cookeditemList = new ArrayList<>(itemsToBeCooked.getHowMany());
            for(int i = 0; i < itemsToBeCooked.getHowMany(); i++) {
                CookedItem cookedItem = new CookedItem();
                cookedItem.setId(UUID.randomUUID());
                cookedItem.setCookableRecipe(recipeOpt.get());
                cookedItem.setPreparationStarted(LocalDateTime.now());
                cookedItem.setReadyToServe(cookedItem.getPreparationStarted().
                        plusSeconds(cookedItem.getCookableRecipe().getMeanCookingTimeInSec()));
                cookeditemList.add(CookedItemDTO.cookedItemDTOFactory(cookedItemRepository.save(cookedItem)));
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(cookeditemList);
        }
    }

    @GetMapping
    public ResponseEntity<List<CookedItemDTO>> getSpecificCookedItems(@RequestParam("state") String stateName) throws WrongQueryParameterException {
        LocalDateTime timePoint = LocalDateTime.now();
        switch (stateName) {
            case "readyToBeServed":
                return ResponseEntity.ok(CookedItemDTO.cookedItemDTOFactoryList(cookedItemRepository.findReadyToBeServedCookedItems(timePoint)));
            case "preparationStarted":
                return ResponseEntity.ok(CookedItemDTO.cookedItemDTOFactoryList(cookedItemRepository.findReadyPreparationStartedCookedItems(timePoint)));
            default:
                throw new WrongQueryParameterException(stateName);
        }
    }


    @PostMapping("/{cookedItemId}/takenToTable") // declaration by the waiter that the item is brought to the table
    public ResponseEntity<CookedItemDTO> itemIsServed(@PathVariable("cookedItemId") UUID cookedItemId)
            throws CookedItemNotFoundException, CookedItemAlreadyTakenFromKitchenException, CookedItemNotReadyInKitchenYetException {
        Optional<CookedItem> cookedItemOpt = cookedItemRepository.findById(cookedItemId);
        if (cookedItemOpt.isEmpty()) {
            throw new CookedItemNotFoundException(cookedItemId);
        } else {
            CookedItem cookedItem = cookedItemOpt.get();
            if (cookedItem.getTakenForService() != null) {
                throw new CookedItemAlreadyTakenFromKitchenException(cookedItem);
            } else if (cookedItem.getReadyToServe().isAfter(LocalDateTime.now())) {
                throw new CookedItemNotReadyInKitchenYetException(cookedItem);
            } else {
                cookedItem.setTakenForService(LocalDateTime.now());
                return ResponseEntity.ok(CookedItemDTO.cookedItemDTOFactory(cookedItemRepository.save(cookedItem)));
            }
        }
    }

}
