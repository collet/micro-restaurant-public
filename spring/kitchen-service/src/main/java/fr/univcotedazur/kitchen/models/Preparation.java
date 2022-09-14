package fr.univcotedazur.kitchen.models;

import com.fasterxml.jackson.annotation.JsonView;
import org.springframework.data.annotation.Id;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

public class Preparation {

    @Id
    @NotNull
    @JsonView(Views.Public.class)
    private UUID id;

    @Positive
    @JsonView(Views.Public.class)
    private Long tableId;

    @NotNull
    @JsonView(Views.Public.class)
    private LocalDateTime shouldBeReadyAt;

    @JsonView(Views.Public.class)
    private LocalDateTime completedAt;

    @JsonView(Views.Public.class)
    private LocalDateTime takenForServiceAt; // brought to the table

    @NotNull
    @Size(min = 1)
    @JsonView(Views.Public.class)
    private List<PreparedItem> preparedItems;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Long getTableId() {
        return tableId;
    }

    public void setTableId(Long tableId) {
        this.tableId = tableId;
    }

    public LocalDateTime getShouldBeReadyAt() {
        return shouldBeReadyAt;
    }

    public void setShouldBeReadyAt(LocalDateTime shouldBeReadyAt) {
        this.shouldBeReadyAt = shouldBeReadyAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public LocalDateTime getTakenForServiceAt() {
        return takenForServiceAt;
    }

    public void setTakenForServiceAt(LocalDateTime takenForServiceAt) {
        this.takenForServiceAt = takenForServiceAt.withNano(0);
    }

    public List<PreparedItem> getPreparedItems() {
        return preparedItems;
    }

    public void setPreparedItems(List<PreparedItem> preparedItems) {
        this.preparedItems = preparedItems;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Preparation)) return false;
        Preparation that = (Preparation) o;
        return id.equals(that.id) && tableId.equals(that.tableId) && shouldBeReadyAt.equals(that.shouldBeReadyAt) && Objects.equals(completedAt, that.completedAt) && Objects.equals(takenForServiceAt, that.takenForServiceAt) && preparedItems.equals(that.preparedItems);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, tableId, shouldBeReadyAt, completedAt, takenForServiceAt, preparedItems);
    }
}
