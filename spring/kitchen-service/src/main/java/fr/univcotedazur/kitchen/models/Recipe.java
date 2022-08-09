package fr.univcotedazur.kitchen.models;

import org.springframework.data.annotation.Id;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.temporal.TemporalAmount;
import java.util.List;
import java.util.UUID;

public class Recipe {

        @Id
        @NotBlank
        private String shortName; // the short name of the menu item serves here as Id
        // The Id itself is used upward in the process flow between menu and dining.
        // Here the kitchen handles the name and the recipes and produces CookedItem
        // following a type-instance pattern

        @NotNull
        private List<String> cookingSteps;

        @NotNull
        private int meanCookingTimeInSec; // should be a TemporalAmount

        public String getShortName() {
                return shortName;
        }

        public void setShortName(String shortName) {
                this.shortName = shortName;
        }

        public List<String> getCookingSteps() {
                return cookingSteps;
        }

        public void setCookingSteps(List<String> cookingSteps) {
                this.cookingSteps = cookingSteps;
        }


        public int getMeanCookingTimeInSec() {
                return meanCookingTimeInSec;
        }

        public void setMeanCookingTimeInSec(int meanCookingTimeInSec) {
                this.meanCookingTimeInSec = meanCookingTimeInSec;
        }

        public Recipe(String shortName, List<String> cookingSteps, int meanCookingTimeInSec) {
                this.shortName = shortName;
                this.cookingSteps = cookingSteps;
                this.meanCookingTimeInSec = meanCookingTimeInSec;
        }
}
