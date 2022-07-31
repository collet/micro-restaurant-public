package fr.univcotedazur.dining.exceptions;

public class TableIdNotFoundException extends Exception {

    private Long idNotFound;

    public TableIdNotFoundException(Long idNotFound) {
        this.idNotFound = idNotFound;
    }

    public Long getIdNotFound() {
        return idNotFound;
    }

    public void setIdNotFound(Long idNotFound) {
        this.idNotFound = idNotFound;
    }

}
