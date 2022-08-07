package fr.univcotedazur.dining.controllers;

import fr.univcotedazur.dining.controllers.dto.ErrorDTO;
import fr.univcotedazur.dining.exceptions.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(assignableTypes = {DiningController.class,TableController.class})
public class DiningControllerAdvice {

    @ExceptionHandler({TableAlreadyExistingException.class})
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorDTO handleExceptions(TableAlreadyExistingException e)  {
        ErrorDTO errorDTO = new ErrorDTO();
        errorDTO.setError("Table number already exists");
        errorDTO.setDetails(e.getAlreadyUsedNumber() + " is already used");
        return errorDTO;
    }

    @ExceptionHandler({TableIdNotFoundException.class})
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorDTO handleExceptions(TableIdNotFoundException e)  {
        ErrorDTO errorDTO = new ErrorDTO();
        errorDTO.setError("Table not found");
        errorDTO.setDetails(e.getIdNotFound() + " is not a valid table Id");
        return errorDTO;
    }

    @ExceptionHandler({TableAlreadyTakenException.class})
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    public ErrorDTO handleExceptions(TableAlreadyTakenException e)  {
        ErrorDTO errorDTO = new ErrorDTO();
        errorDTO.setError("Table is already taken");
        errorDTO.setDetails(e.getAlreadyTakenTableNumber() + " is the Id of a table already taken by some customers");
        return errorDTO;
    }

    @ExceptionHandler({TableOrderIdNotFoundException.class})
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorDTO handleExceptions(TableOrderIdNotFoundException e)  {
        ErrorDTO errorDTO = new ErrorDTO();
        errorDTO.setError("Table order not found");
        errorDTO.setDetails(e.getIdNotFound() + " is not a valid table order Id");
        return errorDTO;
    }

    @ExceptionHandler({TableOrderAlreadyBilledException.class})
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    public ErrorDTO handleExceptions(TableOrderAlreadyBilledException e)  {
        ErrorDTO errorDTO = new ErrorDTO();
        errorDTO.setError("TableOrder is already billed");
        errorDTO.setDetails(e.getTableOrderId() + " is the Id of a tableOrder (on table " +
                e.getTableNumber() + ") already billed");
        return errorDTO;
    }

    @ExceptionHandler({ItemDTONotFoundException.class})
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorDTO handleExceptions(ItemDTONotFoundException e)  {
        ErrorDTO errorDTO = new ErrorDTO();
        errorDTO.setError("Inconsistent ItemDTO with the MenuServiceProxy");
        errorDTO.setDetails(e.getItemDTONotCorrespondingtoMenuItem().getId() + " is not a valid MenuItem Id or " +
                e.getItemDTONotCorrespondingtoMenuItem().getShortName() +
                "is not a valid MenuItem short name or the pair Id/shortname is not consistent with the MenuItem");
        return errorDTO;
    }

}
