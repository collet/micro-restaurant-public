package fr.univcotedazur.kitchen.exceptions;

public class ItemsToBeCookedDTONotFoundException extends Exception {

    public String getShortNameOfItemsToBeCooked() {
        return shortNameOfItemsToBeCooked;
    }

    public void setShortNameOfItemsToBeCooked(String shortNameOfItemsToBeCooked) {
        this.shortNameOfItemsToBeCooked = shortNameOfItemsToBeCooked;
    }

    private String shortNameOfItemsToBeCooked;

    public ItemsToBeCookedDTONotFoundException(String shortName) {
        shortNameOfItemsToBeCooked = shortName;
    }
}
