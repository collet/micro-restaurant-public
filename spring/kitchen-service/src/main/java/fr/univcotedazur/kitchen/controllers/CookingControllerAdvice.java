package fr.univcotedazur.kitchen.controllers;

import fr.univcotedazur.kitchen.controllers.dto.ErrorDTO;
import fr.univcotedazur.kitchen.exceptions.ItemAlreadyFinishedToBeCookedException;
import fr.univcotedazur.kitchen.exceptions.ItemAlreadyStartedToBeCookedException;
import fr.univcotedazur.kitchen.exceptions.ItemNotStartedToBeCookedException;
import fr.univcotedazur.kitchen.exceptions.PreparedItemIdNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(assignableTypes = {CookingController.class})
public class CookingControllerAdvice {

    @ExceptionHandler({PreparedItemIdNotFoundException.class})
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorDTO handleExceptions(PreparedItemIdNotFoundException e) {
        ErrorDTO errorDTO = new ErrorDTO();
        errorDTO.setError("Prepared Item UUID not found by the kitchen");
        errorDTO.setDetails(e.getPreparedItemId() + " is not known");
        return errorDTO;
    }

    @ExceptionHandler({IllegalArgumentException.class})
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorDTO handleExceptions(IllegalArgumentException e) {
        ErrorDTO errorDTO = new ErrorDTO();
        errorDTO.setError("Post name not known by the kitchen");
        errorDTO.setDetails(e.getMessage());
        return errorDTO;
    }

    @ExceptionHandler({ItemAlreadyStartedToBeCookedException.class})
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    public ErrorDTO handleExceptions(ItemAlreadyStartedToBeCookedException e) {
        ErrorDTO errorDTO = new ErrorDTO();
        errorDTO.setError("Item already started cooking inside the kitchen");
        errorDTO.setDetails("Item " + e.getPreparedItem().getId() + " started at " + e.getPreparedItem().getStartedAt());
        return errorDTO;
    }

    @ExceptionHandler({ItemAlreadyFinishedToBeCookedException.class})
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    public ErrorDTO handleExceptions(ItemAlreadyFinishedToBeCookedException e) {
        ErrorDTO errorDTO = new ErrorDTO();
        errorDTO.setError("Item already finished of being cooked in the kitchen");
        errorDTO.setDetails("Item " + e.getPreparedItem().getId() + " finished at " + e.getPreparedItem().getFinishedAt());
        return errorDTO;
    }

    @ExceptionHandler({ItemNotStartedToBeCookedException.class})
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    public ErrorDTO handleExceptions(ItemNotStartedToBeCookedException e) {
        ErrorDTO errorDTO = new ErrorDTO();
        errorDTO.setError("Item not started to be cooked inside the kitchen");
        errorDTO.setDetails("Item "  + e.getPreparedItem().getId());
        return errorDTO;
    }

}
