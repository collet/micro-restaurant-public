package fr.univcotedazur.kitchen.exceptions;

import fr.univcotedazur.kitchen.models.PreparedItem;

public class ItemAlreadyFinishedToBeCookedException extends Exception {

    private PreparedItem preparedItem;

    public PreparedItem getPreparedItem() {
        return preparedItem;
    }

    public ItemAlreadyFinishedToBeCookedException(PreparedItem preparedItem) {
        this.preparedItem = preparedItem;
    }
}
