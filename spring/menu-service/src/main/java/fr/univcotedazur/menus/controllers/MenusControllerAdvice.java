package fr.univcotedazur.menus.controllers;

import fr.univcotedazur.menus.controllers.dto.ErrorDTO;
import fr.univcotedazur.menus.exceptions.MenuItemIdNotFoundException;
import fr.univcotedazur.menus.exceptions.MenuItemShortNameAlreadyExistsException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(assignableTypes = {MenuController.class})
public class MenusControllerAdvice {

        @ExceptionHandler({MenuItemShortNameAlreadyExistsException.class})
        @ResponseStatus(HttpStatus.CONFLICT)
        public ErrorDTO handleExceptions(MenuItemShortNameAlreadyExistsException e)  {
            ErrorDTO errorDTO = new ErrorDTO();
            errorDTO.setError("Menu short name already exists");
            errorDTO.setDetails(e.getShortNameAlreadyExists() + " is already used");
            return errorDTO;
        }

        @ExceptionHandler({MenuItemIdNotFoundException.class})
        @ResponseStatus(HttpStatus.NOT_FOUND)
        public ErrorDTO handleExceptions(MenuItemIdNotFoundException e)  {
            ErrorDTO errorDTO = new ErrorDTO();
            errorDTO.setError("MenuItem not found");
            errorDTO.setDetails(e.getMenuItemIdNotFound() + " is not a valid menu item Id");
            return errorDTO;
        }

}
