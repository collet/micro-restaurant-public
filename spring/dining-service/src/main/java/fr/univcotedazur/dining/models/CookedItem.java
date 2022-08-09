package fr.univcotedazur.dining.models;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.UUID;

public class CookedItem {

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


}
