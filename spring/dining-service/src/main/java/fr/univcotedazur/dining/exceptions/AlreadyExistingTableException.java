package fr.univcotedazur.dining.exceptions;

public class AlreadyExistingTableException extends Exception {

    private Long alreadyUsedNumber;

    public AlreadyExistingTableException(Long alreadyUsedNumber) {
        this.alreadyUsedNumber = alreadyUsedNumber;
    }

    public Long getAlreadyUsedNumber() {
        return alreadyUsedNumber;
    }

    public void setAlreadyUsedNumber(Long alreadyUsedNumber) {
        this.alreadyUsedNumber = alreadyUsedNumber;
    }

}
