package fr.univcotedazur.dining.controllers.dto;

import javax.validation.constraints.Positive;

public class StartOrderingDTO {

    @Positive
    private Long tableId;

    @Positive
    private int customersCount;

    public int getCustomersCount() {
        return customersCount;
    }

    public void setCustomersCount(int customersCount) {
        this.customersCount = customersCount;
    }

    public Long getTableId() {
        return tableId;
    }

    public void setTableId(Long tableId) {
        this.tableId = tableId;
    }

}
