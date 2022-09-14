package fr.univcotedazur.kitchen.exceptions;

public class EmptyItemsToBeCookedSentInKitchenException extends Exception {

    private final Long tableId;

    public Long getTableId() {
        return tableId;
    }

    public EmptyItemsToBeCookedSentInKitchenException(Long tableId) {
        this.tableId = tableId;
    }
}
