package fr.univcotedazur.kitchen.exceptions;

public class WrongStateNameForPreparationException extends Exception {

    private final String badStateNameForQuery;

    public String getBadStateNameForQuery() {
        return badStateNameForQuery;
    }

    public WrongStateNameForPreparationException(String stateName) {
        this.badStateNameForQuery = stateName;
    }
}
