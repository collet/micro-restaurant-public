package fr.univcotedazur.kitchen.exceptions;

import fr.univcotedazur.kitchen.models.PreparedItem;

public class ItemNotStartedToBeCookedException extends Exception {

    private PreparedItem preparedItem;

    public PreparedItem getPreparedItem() {
        return preparedItem;
    }

    public ItemNotStartedToBeCookedException(PreparedItem preparedItem) {
        this.preparedItem = preparedItem;
    }
}
