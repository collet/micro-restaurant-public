package fr.univcotedazur.dining.models;

import org.springframework.data.annotation.Id;

import javax.validation.constraints.NotBlank;
import java.util.Objects;

public class OrderingItem {

    @Id
    private String id; // id of the item from the menu

    @NotBlank
    private String shortName;

    @NotBlank
    private String category; // category is a String here to show that type (or full tech stack) could be different
    // for menu and dining services

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getShortName() {
        return shortName;
    }

    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof OrderingItem)) return false;
        OrderingItem that = (OrderingItem) o;
        return Objects.equals(id, that.id) && Objects.equals(shortName, that.shortName) && Objects.equals(category, that.category);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, shortName, category);
    }


}
