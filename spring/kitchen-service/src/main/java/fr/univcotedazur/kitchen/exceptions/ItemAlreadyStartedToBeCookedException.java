package fr.univcotedazur.kitchen.exceptions;

import fr.univcotedazur.kitchen.models.PreparedItem;

public class ItemAlreadyStartedToBeCookedException extends Exception {

    private PreparedItem preparedItem;

    public PreparedItem getPreparedItem() {
        return preparedItem;
    }

    public ItemAlreadyStartedToBeCookedException(PreparedItem preparedItem) {
        this.preparedItem = preparedItem;
    }
}
