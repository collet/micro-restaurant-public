package fr.univcotedazur.menus.exceptions;

public class MenuItemShortNameAlreadyExistsException extends Exception {

    private String shortNameAlreadyExists;

    public String getShortNameAlreadyExists() {
        return shortNameAlreadyExists;
    }

    public void setShortNameAlreadyExists(String shortNameAlreadyExists) {
        this.shortNameAlreadyExists = shortNameAlreadyExists;
    }

    public MenuItemShortNameAlreadyExistsException(String shortNameAlreadyTaken) {
        this.shortNameAlreadyExists = shortNameAlreadyTaken;
    }
}

