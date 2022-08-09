package fr.univcotedazur.kitchen.exceptions;

public class WrongQueryParameterException extends Exception {

    String badStateNameForQuery;

    public String getBadStateNameForQuery() {
        return badStateNameForQuery;
    }
    public WrongQueryParameterException(String stateName) {
        this.badStateNameForQuery = stateName;
    }
}
