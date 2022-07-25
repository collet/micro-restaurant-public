package fr.univcotedazur.dining.models;

import org.springframework.data.annotation.Id;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.time.LocalDateTime;
import java.util.List;

public class TableOrder {

        @Id
        private String id;

        private Table table;

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

        public Table getTable() {
                return table;
        }

        public void setTable(Table table) {
                this.table = table;
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
                this.opened = opened;
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
                this.billed = billed;
        }

}
