package fr.univcotedazur.dining.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Document
public class TableOrder {

        @Id
        private String id;

        private Long tableNumber;

        @Positive
        private int numberOfCustomers;

        @NotNull
        private LocalDateTime opened;

        private List<OrderingLine> lines;

        private LocalDateTime billed;

        public String getId() {
                return id;
        }

        public void setId(String id) {
                this.id = id;
        }

        public Long getTableNumber() {
                return tableNumber;
        }

        public void setTableNumber(Long tableNumber) {
                this.tableNumber = tableNumber;
        }

        public int getNumberOfCustomers() {
                return numberOfCustomers;
        }

        public void setNumberOfCustomers(int numberOfCustomers) {
                this.numberOfCustomers = numberOfCustomers;
        }

        public LocalDateTime getOpened() {
                return opened;
        }

        public void setOpened(LocalDateTime opened) {
                this.opened = opened.withNano(0); // MongoDB is precise at millisecond, not nano (avoid equality problem)
        }

        public List<OrderingLine> getLines() {
                return lines;
        }

        public void setLines(List<OrderingLine> lines) {
                this.lines = lines;
        }

        public LocalDateTime getBilled() {
                return billed;
        }

        public void setBilled(LocalDateTime billed) {
                this.billed = billed.withNano(0);
        }

        @Override
        public boolean equals(Object o) {
                if (this == o) return true;
                if (!(o instanceof TableOrder)) return false;
                TableOrder that = (TableOrder) o;
                return numberOfCustomers == that.numberOfCustomers && Objects.equals(id, that.id) && Objects.equals(tableNumber, that.tableNumber) && Objects.equals(opened, that.opened) && Objects.equals(lines, that.lines) && Objects.equals(billed, that.billed);
        }

        @Override
        public int hashCode() {
                return Objects.hash(id, tableNumber, numberOfCustomers, opened, lines, billed);
        }
}
