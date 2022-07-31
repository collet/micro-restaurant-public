package fr.univcotedazur.dining.exceptions;

public class TableNotTakenException extends Exception {

    private Long notTakenTableNumber;

    public Long getNotTakenTableNumber() {
        return notTakenTableNumber;
    }

    public void setNotTakenTableNumber(Long notTakenTableNumber) {
        this.notTakenTableNumber = notTakenTableNumber;
    }

    public TableNotTakenException(Long notTakenTableNumber) {
        this.notTakenTableNumber = notTakenTableNumber;
    }
}
