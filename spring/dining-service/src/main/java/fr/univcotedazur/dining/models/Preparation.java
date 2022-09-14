package fr.univcotedazur.dining.models;

import org.springframework.data.annotation.Id;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

public class Preparation {

    @Id
    @NotNull
    private UUID id;

    @NotNull
    private LocalDateTime shouldBeReadyAt;

    @NotNull
    private List<CookedItem> preparedItems;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public LocalDateTime getShouldBeReadyAt() {
        return shouldBeReadyAt;
    }

    public void setShouldBeReadyAt(LocalDateTime shouldBeReadyAt) {
        this.shouldBeReadyAt = shouldBeReadyAt;
    }

    public List<CookedItem> getPreparedItems() {
        return preparedItems;
    }

    public void setPreparedItems(List<CookedItem> preparedItems) {
        this.preparedItems = preparedItems;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Preparation)) return false;
        Preparation that = (Preparation) o;
        return id.equals(that.id) && shouldBeReadyAt.equals(that.shouldBeReadyAt) && preparedItems.equals(that.preparedItems);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, shouldBeReadyAt, preparedItems);
    }
}
