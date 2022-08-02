package fr.univcotedazur.dining.exceptions;

public class TableAlreadyExistingException extends Exception {

    private Long alreadyUsedNumber;

    public TableAlreadyExistingException(Long alreadyUsedNumber) {
        this.alreadyUsedNumber = alreadyUsedNumber;
    }

    public Long getAlreadyUsedNumber() {
        return alreadyUsedNumber;
    }

    public void setAlreadyUsedNumber(Long alreadyUsedNumber) {
        this.alreadyUsedNumber = alreadyUsedNumber;
    }

}
