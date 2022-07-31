package fr.univcotedazur.dining.exceptions;

public class TableOrderAlreadyBilled extends Exception {

    private Long tableNumber;

    private String tableOrderId;

    public Long getTableNumber() {
        return tableNumber;
    }

    public void setTableNumber(Long tableNumber) {
        this.tableNumber = tableNumber;
    }

    public String getTableOrderId() {
        return tableOrderId;
    }

    public void setTableOrderId(String tableOrderId) {
        this.tableOrderId = tableOrderId;
    }

    public TableOrderAlreadyBilled(Long tableNumber, String tableOrderId) {
        this.tableNumber = tableNumber;
        this.tableOrderId = tableOrderId;
    }

}
