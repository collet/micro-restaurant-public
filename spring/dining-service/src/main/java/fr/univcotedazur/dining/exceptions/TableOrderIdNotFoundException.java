package fr.univcotedazur.dining.exceptions;

import java.util.UUID;

public class TableOrderIdNotFoundException extends Exception {

    private UUID idNotFound;

    public UUID getIdNotFound() {
        return idNotFound;
    }

    public void setIdNotFound(UUID idNotFound) {
        this.idNotFound = idNotFound;
    }

    public TableOrderIdNotFoundException(UUID idNotFound) {
        this.idNotFound = idNotFound;
    }
}
