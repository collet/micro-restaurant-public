package fr.univcotedazur.kitchen.models;

import org.springframework.data.annotation.Id;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.UUID;

public class CookedItem {

    @Id
    private UUID id;

    @NotNull
    private Recipe cookableRecipe;

    @NotNull
    private LocalDateTime preparationStarted;

    private LocalDateTime readyToServe; // ready in the kitchen

    private LocalDateTime takenForService; // brought to the table

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Recipe getCookableRecipe() {
        return cookableRecipe;
    }

    public void setCookableRecipe(Recipe cookableRecipe) {
        this.cookableRecipe = cookableRecipe;
    }

    public LocalDateTime getPreparationStarted() {
        return preparationStarted;
    }

    public void setPreparationStarted(LocalDateTime preparationStarted) {
        this.preparationStarted = preparationStarted.withNano(0); // MongoDB is precise at millisecond, not nano (avoid equality problem)
    }

    public LocalDateTime getReadyToServe() {
        return readyToServe;
    }

    public void setReadyToServe(LocalDateTime readyToServe) {
        this.readyToServe = readyToServe.withNano(0);
    }

    public LocalDateTime getTakenForService() {
        return takenForService;
    }

    public void setTakenForService(LocalDateTime takenForService) {
        this.takenForService = takenForService.withNano(0);
    }
}
