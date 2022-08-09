package fr.univcotedazur.kitchen.exceptions;

import fr.univcotedazur.kitchen.models.CookedItem;

public class CookedItemNotReadyInKitchenYetException extends Exception {

    CookedItem cookedItem;

    public CookedItem getCookedItem() {
        return cookedItem;
    }

    public CookedItemNotReadyInKitchenYetException(CookedItem cookedItem) {
        this.cookedItem = cookedItem;
    }

}
