package fr.univcotedazur.kitchen.exceptions;

import fr.univcotedazur.kitchen.models.Preparation;

public class PreparationNotReadyInKitchenException extends Exception {

    private final Preparation preparation;

    public Preparation getPreparation() {
        return preparation;
    }

    public PreparationNotReadyInKitchenException(Preparation preparation) {
        this.preparation = preparation;
    }

}
