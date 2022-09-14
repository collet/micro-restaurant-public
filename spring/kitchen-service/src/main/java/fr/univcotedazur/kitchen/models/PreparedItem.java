package fr.univcotedazur.kitchen.models;

import com.fasterxml.jackson.annotation.JsonView;
import org.springframework.data.annotation.Id;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

public class PreparedItem {

    @Id
    @JsonView(Views.Public.class)
    private UUID id;

    @NotNull
    @JsonView(Views.Public.class)
    private String shortName;

    @NotNull
    @JsonView(Views.Internal.class)
    private Recipe recipe;

    @NotNull
    @JsonView(Views.Public.class)
    private LocalDateTime shouldStartAt;

    @JsonView(Views.Public.class)
    private LocalDateTime startedAt;

    @JsonView(Views.Public.class)
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

    public Recipe getRecipe() {
        return recipe;
    }

    public void setRecipe(Recipe recipe) {
        this.recipe = recipe;
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
        this.startedAt = startedAt.withNano(0); // MongoDB is precise at millisecond, not nano (avoid equality problem)
    }

    public LocalDateTime getFinishedAt() {
        return finishedAt;
    }

    public void setFinishedAt(LocalDateTime finishedAt) {
        this.finishedAt = finishedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PreparedItem)) return false;
        PreparedItem that = (PreparedItem) o;
        return id.equals(that.id) && shortName.equals(that.shortName) && recipe.equals(that.recipe) && shouldStartAt.equals(that.shouldStartAt) && Objects.equals(startedAt, that.startedAt) && Objects.equals(finishedAt, that.finishedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, shortName, recipe, shouldStartAt, startedAt, finishedAt);
    }
}
