package fr.univcotedazur.dining.models;

import org.springframework.data.annotation.Id;

import javax.validation.constraints.NotBlank;
import java.util.Objects;

public class OrderingItem {

    @Id
    private String id; // id of the item from the menu

    @NotBlank
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof OrderingItem)) return false;
        OrderingItem that = (OrderingItem) o;
        return Objects.equals(id, that.id) && Objects.equals(shortName, that.shortName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, shortName);
    }
}
