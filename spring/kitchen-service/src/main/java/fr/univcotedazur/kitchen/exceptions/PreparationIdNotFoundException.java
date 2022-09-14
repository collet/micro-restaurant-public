package fr.univcotedazur.kitchen.exceptions;

import java.util.UUID;

public class PreparationIdNotFoundException extends Exception {

    private final UUID preparationId;

    public UUID getPreparationId() {
        return preparationId;
    }
    public PreparationIdNotFoundException(UUID preparationId) {
        this.preparationId = preparationId;
    }
}
