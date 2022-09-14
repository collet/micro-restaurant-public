package fr.univcotedazur.inttest.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class DiningPreparationDTO {

    private UUID id;

    private LocalDateTime shouldBeReadyAt;

    private List<DiningCookedItemDTO> preparedItems;

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

    public List<DiningCookedItemDTO> getPreparedItems() {
        return preparedItems;
    }

    public void setPreparedItems(List<DiningCookedItemDTO> diningCookedItemDTOS) {
        this.preparedItems = diningCookedItemDTOS;
    }
}
