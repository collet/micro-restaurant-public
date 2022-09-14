package fr.univcotedazur.kitchen.exceptions;

import fr.univcotedazur.kitchen.models.PreparedItem;

import java.util.UUID;

public class PreparedItemIdNotFoundException extends Exception {

    private final UUID preparedItemId;

    public UUID getPreparedItemId() {
        return preparedItemId;
    }

    public PreparedItemIdNotFoundException(UUID preparedItemId) {
        this.preparedItemId = preparedItemId;
    }
}
