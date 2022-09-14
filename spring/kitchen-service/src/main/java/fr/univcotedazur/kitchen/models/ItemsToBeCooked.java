package fr.univcotedazur.kitchen.models;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Positive;

public class ItemsToBeCooked {

    @NotBlank
    private String shortName; // shortName of the item from the menu (unique id in the kitchen context model)

    @Positive
    private int howMany;

    public String getShortName() {
        return shortName;
    }

    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

    public int getHowMany() {
        return howMany;
    }

    public void setHowMany(int howMany) {
        this.howMany = howMany;
    }
}
