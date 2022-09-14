package fr.univcotedazur.kitchen.exceptions;

import java.util.List;

public class ItemsToBeCookedNotFoundException extends Exception {

    private List<String> shortNamesOfItemsToBeCooked;

    public List<String> getShortNamesOfItemsToBeCooked() {
        return shortNamesOfItemsToBeCooked;
    }

    public void setShortNameOfItemsToBeCooked(List<String> shortNameOfItemsToBeCooked) {
        this.shortNamesOfItemsToBeCooked = shortNameOfItemsToBeCooked;
    }

    public ItemsToBeCookedNotFoundException(List<String> shortNames) {
        shortNamesOfItemsToBeCooked = shortNames;
    }
}
