package fr.univcotedazur.dining.exceptions;

import fr.univcotedazur.dining.controllers.dto.ItemDTO;

public class ItemDTONotFoundException extends Exception {

    private ItemDTO itemDTONotCorrespondingtoMenuItem;

    public ItemDTO getItemDTONotCorrespondingtoMenuItem() {
        return itemDTONotCorrespondingtoMenuItem;
    }

    public void setItemDTONotCorrespondingtoMenuItem(ItemDTO itemDTONotCorrespondingtoMenuItem) {
        this.itemDTONotCorrespondingtoMenuItem = itemDTONotCorrespondingtoMenuItem;
    }

    public ItemDTONotFoundException(ItemDTO itemDTONotCorrespondingtoMenuItem) {
        this.itemDTONotCorrespondingtoMenuItem = itemDTONotCorrespondingtoMenuItem;
    }
}
