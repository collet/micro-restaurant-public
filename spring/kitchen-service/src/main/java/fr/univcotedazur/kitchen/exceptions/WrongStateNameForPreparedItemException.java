package fr.univcotedazur.kitchen.exceptions;

public class WrongStateNameForPreparedItemException extends Exception {

    private final String badStateNameForQuery;

    public String getBadStateNameForQuery() {
        return badStateNameForQuery;
    }

    public WrongStateNameForPreparedItemException(String stateName) {
        this.badStateNameForQuery = stateName;
    }

}
