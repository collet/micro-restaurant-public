package fr.univcotedazur.inttest.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;
import java.util.UUID;

public class CookedItemDTO {

    private UUID id;

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

}
