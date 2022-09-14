package fr.univcotedazur.inttest.dto;

import java.util.UUID;

public class DiningCookedItemDTO {

    private UUID id;

    private String shortName;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getShortName() {
        return shortName;
    }

    public void setShortName(String shortName) {
        this.shortName = shortName;
    }
}
