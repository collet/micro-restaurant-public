package fr.univcotedazur.menus.exceptions;

import java.util.UUID;

public class MenuItemIdNotFoundException extends Throwable {

    UUID menuItemIdNotFound;

    public UUID getMenuItemIdNotFound() {
        return menuItemIdNotFound;
    }

    public void setMenuItemIdNotFound(UUID menuItemIdNotFound) {
        this.menuItemIdNotFound = menuItemIdNotFound;
    }

    public MenuItemIdNotFoundException(UUID menuItemId) {
        menuItemIdNotFound = menuItemId;
    }
}
