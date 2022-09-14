package fr.univcotedazur.inttest.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;
import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
public class KitchenPreparedItemDTO {

    private UUID id;

    private String shortName;

    private LocalDateTime shouldStartAt;

    private LocalDateTime startedAt;

    private LocalDateTime finishedAt;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getShortName() {
        return shortName;
    }

    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

    public LocalDateTime getShouldStartAt() {
        return shouldStartAt;
    }

    public void setShouldStartAt(LocalDateTime shouldStartAt) {
        this.shouldStartAt = shouldStartAt;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getFinishedAt() {
        return finishedAt;
    }

    public void setFinishedAt(LocalDateTime finishedAt) {
        this.finishedAt = finishedAt;
    }
}
