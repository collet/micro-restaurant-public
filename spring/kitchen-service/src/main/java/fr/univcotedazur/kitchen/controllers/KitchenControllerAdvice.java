package fr.univcotedazur.kitchen.controllers;

import fr.univcotedazur.kitchen.controllers.dto.ErrorDTO;
import fr.univcotedazur.kitchen.exceptions.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(assignableTypes = {KitchenController.class})
public class KitchenControllerAdvice {

    @ExceptionHandler({ItemsToBeCookedDTONotFoundException.class})
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorDTO handleExceptions(ItemsToBeCookedDTONotFoundException e) {
        ErrorDTO errorDTO = new ErrorDTO();
        errorDTO.setError("Item to be cooked is not known by the kitchen");
        errorDTO.setDetails(e.getShortNameOfItemsToBeCooked() + " is not known");
        return errorDTO;
    }

    @ExceptionHandler({CookedItemNotFoundException.class})
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorDTO handleExceptions(CookedItemNotFoundException e) {
        ErrorDTO errorDTO = new ErrorDTO();
        errorDTO.setError("CookedItem UUID not found by the kitchen");
        errorDTO.setDetails(e.getCookedItemId() + " is not known");
        return errorDTO;
    }

    @ExceptionHandler({CookedItemAlreadyTakenFromKitchenException.class})
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    public ErrorDTO handleExceptions(CookedItemAlreadyTakenFromKitchenException e) {
        ErrorDTO errorDTO = new ErrorDTO();
        errorDTO.setError("CookedItem already taken from the kitchen");
        errorDTO.setDetails("with UUID " + e.getCookedItem().getId() +
                " taken at " + e.getCookedItem().getTakenForService());
        return errorDTO;
    }

    @ExceptionHandler({CookedItemNotReadyInKitchenYetException.class})
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    public ErrorDTO handleExceptions(CookedItemNotReadyInKitchenYetException e) {
        ErrorDTO errorDTO = new ErrorDTO();
        errorDTO.setError("CookedItem not yet ready in the kitchen");
        errorDTO.setDetails("with UUID " + e.getCookedItem().getId() +
                " should be ready at " + e.getCookedItem().getReadyToServe());
        return errorDTO;
    }

    @ExceptionHandler({WrongQueryParameterException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorDTO handleExceptions(WrongQueryParameterException e) {
        ErrorDTO errorDTO = new ErrorDTO();
        errorDTO.setError("Searching through cookedItems by state only support 2 state names (readyToBeServed,preparationStarted)");
        errorDTO.setDetails(" state name is " + e.getBadStateNameForQuery());
        return errorDTO;
    }
}
