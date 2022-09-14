package fr.univcotedazur.kitchen.exceptions;

public class RecipeNotFoundException extends RuntimeException {

    private final String recipeName;

    public String getRecipeName() {
        return recipeName;
    }

    public RecipeNotFoundException(String recipeName) {
        this.recipeName = recipeName;
    }
}
