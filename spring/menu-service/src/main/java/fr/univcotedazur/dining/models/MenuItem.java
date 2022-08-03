package fr.univcotedazur.dining.models;

import org.springframework.data.annotation.Id;

import java.util.UUID;

public class MenuItem {

        @Id
        private UUID id;

        private String fullName;

        private String shortName;

        private double price; // in euro

        public UUID getId() {
                return id;
        }

        public void setId(UUID id) {
                this.id = id;
        }

        public String getFullName() {
                return fullName;
        }

        public void setFullName(String fullName) {
                this.fullName = fullName;
        }

        public String getShortName() {
                return shortName;
        }

        public void setShortName(String shortName) {
                this.shortName = shortName;
        }

        public double getPrice() {
                return price;
        }

        public void setPrice(double price) {
                this.price = price;
        }

}
