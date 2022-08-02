package fr.univcotedazur.dining.controllers.dto;

import javax.validation.constraints.Positive;

public class TableCreationDTO {

    @Positive
    private Long tableId;

    public Long getTableId() {
        return tableId;
    }

    public void setTableId(Long tableId) {
        this.tableId = tableId;
    }

}
