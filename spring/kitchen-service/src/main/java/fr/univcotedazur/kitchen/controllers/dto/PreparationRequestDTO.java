package fr.univcotedazur.kitchen.controllers.dto;

import fr.univcotedazur.kitchen.models.ItemsToBeCooked;

import javax.validation.constraints.NotNull;
import java.util.List;

public class PreparationRequestDTO {

    @NotNull
    private Long tableId;

    @NotNull
    private List<ItemsToBeCooked> itemsToBeCookedList;

    public Long getTableId() {
        return tableId;
    }

    public void setTableId(Long tableId) {
        this.tableId = tableId;
    }

    public List<ItemsToBeCooked> getItemsToBeCookedList() {
        return itemsToBeCookedList;
    }

    public void setItemsToBeCookedList(List<ItemsToBeCooked> itemsToBeCookedList) {
        this.itemsToBeCookedList = itemsToBeCookedList;
    }

}
