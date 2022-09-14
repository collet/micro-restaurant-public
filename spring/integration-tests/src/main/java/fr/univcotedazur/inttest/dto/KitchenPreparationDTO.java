package fr.univcotedazur.inttest.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class KitchenPreparationDTO {

    private UUID id;

    private Long tableId;

    private LocalDateTime shouldBeReadyAt;

    private LocalDateTime completedAt;

    private LocalDateTime takenForServiceAt;

    private List<KitchenPreparedItemDTO> preparedItems;

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
        this.takenForServiceAt = takenForServiceAt;
    }

    public List<KitchenPreparedItemDTO> getPreparedItems() {
        return preparedItems;
    }

    public void setPreparedItems(List<KitchenPreparedItemDTO> preparedItems) {
        this.preparedItems = preparedItems;
    }
}
