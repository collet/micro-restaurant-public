package fr.univcotedazur.kitchen.exceptions;

public class TableIdNotFoundException extends Exception {

    private final Long idNotFound;

    public TableIdNotFoundException(Long idNotFound) {
        this.idNotFound = idNotFound;
    }

    public Long getIdNotFound() {
        return idNotFound;
    }

}
