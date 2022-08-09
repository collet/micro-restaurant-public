package fr.univcotedazur.kitchen.exceptions;

import fr.univcotedazur.kitchen.models.CookedItem;

public class CookedItemAlreadyTakenFromKitchenException extends Exception {

    CookedItem cookedItem;

    public CookedItem getCookedItem() {
        return cookedItem;
    }

    public CookedItemAlreadyTakenFromKitchenException(CookedItem cookedItem) {
        this.cookedItem = cookedItem;
    }
}
