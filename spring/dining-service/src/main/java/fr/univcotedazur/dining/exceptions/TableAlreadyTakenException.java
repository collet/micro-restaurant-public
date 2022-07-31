package fr.univcotedazur.dining.exceptions;

public class TableAlreadyTakenException extends Exception {

    private Long alreadyTakenTableNumber;

    public Long getAlreadyTakenTableNumber() {
        return alreadyTakenTableNumber;
    }

    public void setAlreadyTakenTableNumber(Long alreadyTakenTableNumber) {
        this.alreadyTakenTableNumber = alreadyTakenTableNumber;
    }

    public TableAlreadyTakenException(Long alreadyTakenTableNumber) {
        this.alreadyTakenTableNumber = alreadyTakenTableNumber;
    }
}
