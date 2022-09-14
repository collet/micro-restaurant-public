package fr.univcotedazur.dining.components.dto;

import java.util.List;

public class PreparationRequestDTO {

    private Long tableId;

    private List<ItemsToBeCookedInKitchenDTO> itemsToBeCookedList;

    public Long getTableId() {
        return tableId;
    }

    public void setTableId(Long tableId) {
        this.tableId = tableId;
    }

    public List<ItemsToBeCookedInKitchenDTO> getItemsToBeCookedList() {
        return itemsToBeCookedList;
    }

    public void setItemsToBeCookedList(List<ItemsToBeCookedInKitchenDTO> itemsToBeCookedList) {
        this.itemsToBeCookedList = itemsToBeCookedList;
    }
}
