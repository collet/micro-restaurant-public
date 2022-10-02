package fr.univcotedazur.kitchen.controllers;

import com.fasterxml.jackson.annotation.JsonView;
import fr.univcotedazur.kitchen.components.CookingPost;
import fr.univcotedazur.kitchen.components.DiningTableProxy;
import fr.univcotedazur.kitchen.components.KitchenFacade;
import fr.univcotedazur.kitchen.models.ItemsToBeCooked;
import fr.univcotedazur.kitchen.controllers.dto.PreparationRequestDTO;
import fr.univcotedazur.kitchen.exceptions.*;
import fr.univcotedazur.kitchen.models.Preparation;
import fr.univcotedazur.kitchen.models.Views;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
@CrossOrigin
@RequestMapping(path = KitchenController.BASE_URI, produces = APPLICATION_JSON_VALUE)
public class KitchenController {

    public static final String BASE_URI = "/preparations";

    @Autowired
    KitchenFacade kitchenFacade;

    @Autowired
    CookingPost cookingPost;

    @Autowired
    DiningTableProxy diningTableProxy;

    @PostMapping
    @JsonView(Views.Public.class)
    public ResponseEntity<List<Preparation>> takeOrder(@RequestBody @Valid PreparationRequestDTO preparationRequestDTO)
            throws ItemsToBeCookedNotFoundException,
            EmptyItemsToBeCookedSentInKitchenException,
            TableIdNotFoundException {
        List<ItemsToBeCooked> itemsToBeCookedDTOList = preparationRequestDTO.getItemsToBeCookedList();
        if (itemsToBeCookedDTOList.size() == 0) {
            throw new EmptyItemsToBeCookedSentInKitchenException(preparationRequestDTO.getTableId());
        }
        List<String> unKnownNames = itemsToBeCookedDTOList.stream().map(ItemsToBeCooked::getShortName)
                .filter( name -> cookingPost.getRecipeFromItemName(name).isEmpty()).toList();
        if (unKnownNames.size() > 0) {
            throw new ItemsToBeCookedNotFoundException(unKnownNames);
        }
        Long tableId = preparationRequestDTO.getTableId();
        if (! diningTableProxy.isTableIdValid(preparationRequestDTO.getTableId())) {
            throw new TableIdNotFoundException(tableId);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(kitchenFacade.receivePreparationRequest(
                tableId,
                itemsToBeCookedDTOList));
    }

    @GetMapping
    @JsonView(Views.Public.class)
    public ResponseEntity<List<Preparation>> getAllPreparations(@RequestParam("state") String stateName,
                                                                 @RequestParam(value="tableId", required=false) Long tableId)
            throws WrongStateNameForPreparationException, TableIdNotFoundException {
        if (tableId == null) {
            switch (stateName) {
                case "readyToBeServed":
                    return ResponseEntity.ok(kitchenFacade.allPreparationsReady());
                case "preparationStarted":
                    return ResponseEntity.ok(kitchenFacade.allPreparationsNotReady());
                default:
                    throw new WrongStateNameForPreparationException(stateName);
            }
        } else if (diningTableProxy.isTableIdValid(tableId)) {
            switch (stateName) {
                case "readyToBeServed":
                    return ResponseEntity.ok(kitchenFacade.allPreparationsReadyForTable(tableId));
                case "preparationStarted":
                    return ResponseEntity.ok(kitchenFacade.allPreparationsNotReadyForTable(tableId));
                default:
                    throw new WrongStateNameForPreparationException(stateName);
            }
        } else {
            throw new TableIdNotFoundException(tableId);
        }
    }

    @GetMapping("/{preparationId}")
    @JsonView(Views.Public.class)
    public ResponseEntity<Preparation> findPreparationById(@PathVariable("preparationId") UUID preparationId)
            throws PreparationIdNotFoundException {
        return ResponseEntity.ok(kitchenFacade.retrievePreparation(preparationId));
    }

    @PostMapping("/{preparationId}/takenToTable") // declaration by the waiter that the preparation is brought to the table
    @JsonView(Views.Public.class)
    public ResponseEntity<Preparation> preparationIsServed(@PathVariable("preparationId") UUID preparationId)
            throws PreparationAlreadyTakenFromKitchenException, PreparationNotReadyInKitchenException, PreparationIdNotFoundException {
        Preparation preparation = kitchenFacade.retrievePreparation(preparationId);
        if (preparation.getCompletedAt() == null) {
            throw new PreparationNotReadyInKitchenException(preparation);
        }
        if (preparation.getTakenForServiceAt() != null) {
            throw new PreparationAlreadyTakenFromKitchenException(preparation);
        }
        return ResponseEntity.ok(kitchenFacade.takeReadyPreparation(preparation));
    }

}
