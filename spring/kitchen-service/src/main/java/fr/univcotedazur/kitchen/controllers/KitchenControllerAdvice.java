package fr.univcotedazur.kitchen.controllers;

import fr.univcotedazur.kitchen.controllers.dto.ErrorDTO;
import fr.univcotedazur.kitchen.exceptions.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice(assignableTypes = {KitchenController.class})
public class KitchenControllerAdvice {

    @ExceptionHandler({ItemsToBeCookedNotFoundException.class})
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    public ErrorDTO handleExceptions(ItemsToBeCookedNotFoundException e) {
        ErrorDTO errorDTO = new ErrorDTO();
        errorDTO.setError("Some item names not found by the kitchen");
        errorDTO.setDetails(e.getShortNamesOfItemsToBeCooked().stream()
                .collect(Collectors.joining(",", "{", "}")) + " are not known");
        return errorDTO;
    }

    @ExceptionHandler({EmptyItemsToBeCookedSentInKitchenException.class})
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    public ErrorDTO handleExceptions(EmptyItemsToBeCookedSentInKitchenException e) {
        ErrorDTO errorDTO = new ErrorDTO();
        errorDTO.setError("empty item list sent to the kitchen");
        errorDTO.setDetails("from table Id " + e.getTableId());
        return errorDTO;
    }

    @ExceptionHandler({TableIdNotFoundException.class})
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorDTO handleExceptions(TableIdNotFoundException e) {
        ErrorDTO errorDTO = new ErrorDTO();
        errorDTO.setError("Table Id not found by the kitchen");
        errorDTO.setDetails(e.getIdNotFound() + " is not known");
        return errorDTO;
    }

    @ExceptionHandler({WrongStateNameForPreparationException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorDTO handleExceptions(WrongStateNameForPreparationException e) {
        ErrorDTO errorDTO = new ErrorDTO();
        errorDTO.setError("Searching through cookedItems by state only support 2 state names (readyToBeServed,preparationStarted)");
        errorDTO.setDetails(" state name is " + e.getBadStateNameForQuery());
        return errorDTO;
    }

    @ExceptionHandler({PreparationIdNotFoundException.class})
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorDTO handleExceptions(PreparationIdNotFoundException e) {
        ErrorDTO errorDTO = new ErrorDTO();
        errorDTO.setError("Preparation UUID not found by the kitchen");
        errorDTO.setDetails(e.getPreparationId() + " is not known");
        return errorDTO;
    }

    @ExceptionHandler({PreparationAlreadyTakenFromKitchenException.class})
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    public ErrorDTO handleExceptions(PreparationAlreadyTakenFromKitchenException e) {
        ErrorDTO errorDTO = new ErrorDTO();
        errorDTO.setError("Preparation already taken from the kitchen");
        errorDTO.setDetails("with UUID " + e.getPreparation().getId() +
                " taken at " + e.getPreparation().getTakenForServiceAt());
        return errorDTO;
    }

    @ExceptionHandler({PreparationNotReadyInKitchenException.class})
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    public ErrorDTO handleExceptions(PreparationNotReadyInKitchenException e) {
        ErrorDTO errorDTO = new ErrorDTO();
        errorDTO.setError("Preparation not yet ready in the kitchen");
        errorDTO.setDetails("with UUID " + e.getPreparation().getId());
        return errorDTO;
    }

}
