package fr.univcotedazur.kitchen.exceptions;

import fr.univcotedazur.kitchen.models.Preparation;

public class PreparationAlreadyTakenFromKitchenException extends Exception {

    private final Preparation preparation;

    public Preparation getPreparation() {
        return preparation;
    }

    public PreparationAlreadyTakenFromKitchenException(Preparation preparation) {
        this.preparation = preparation;
    }
}
