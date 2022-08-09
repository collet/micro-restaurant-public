package fr.univcotedazur.kitchen.exceptions;

import java.util.UUID;

public class CookedItemNotFoundException extends Exception {

    public UUID getCookedItemId() {
        return cookedItemId;
    }

    private final UUID cookedItemId;

    public CookedItemNotFoundException(UUID cookedItemId) {
        this.cookedItemId = cookedItemId;
    }
}
