package fr.univcotedazur.dining.exceptions;

import java.util.UUID;

public class TableOrderAlreadyBilledException extends Exception {

    private Long tableNumber;

    private UUID tableOrderId;

    public Long getTableNumber() {
        return tableNumber;
    }

    public void setTableNumber(Long tableNumber) {
        this.tableNumber = tableNumber;
    }

    public UUID getTableOrderId() {
        return tableOrderId;
    }

    public void setTableOrderId(UUID tableOrderId) {
        this.tableOrderId = tableOrderId;
    }

    public TableOrderAlreadyBilledException(Long tableNumber, UUID tableOrderId) {
        this.tableNumber = tableNumber;
        this.tableOrderId = tableOrderId;
    }

}
