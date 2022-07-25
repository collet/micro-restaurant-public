package fr.univcotedazur.dining.models;

import org.springframework.data.annotation.Id;

public class OrderingItem {

    @Id
    private String id; // id of the item from the menu

    private String shortName;

    public String getId() {
        return id;
    }

    public String getShortName() {
        return shortName;
    }

    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

}
