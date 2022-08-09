package fr.univcotedazur.kitchen.controllers.dto;

import fr.univcotedazur.kitchen.models.CookedItem;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class CookedItemDTO { // Outside the kitchen, we just have an id of the item cooked and the time is going to be ready

    @NotNull
    private UUID id;

    @NotNull
    private LocalDateTime readyToServe;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public LocalDateTime getReadyToServe() {
        return readyToServe;
    }

    public void setReadyToServe(LocalDateTime readyToServe) {
        this.readyToServe = readyToServe;
    }

    public static CookedItemDTO cookedItemDTOFactory(CookedItem cookedItem) {
        CookedItemDTO cookedItemDTO = new CookedItemDTO();
        cookedItemDTO.setId(cookedItem.getId());
        cookedItemDTO.setReadyToServe(cookedItem.getReadyToServe());
        return cookedItemDTO;
    }

    public static List<CookedItemDTO> cookedItemDTOFactoryList(List<CookedItem> cookedItemList) {
        return cookedItemList.stream().map( c -> cookedItemDTOFactory(c)).toList();
    }

}
