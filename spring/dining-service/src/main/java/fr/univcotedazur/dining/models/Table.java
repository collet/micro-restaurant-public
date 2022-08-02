package fr.univcotedazur.dining.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.validation.constraints.Positive;
import java.util.Objects;

import static org.springframework.data.mongodb.core.mapping.FieldType.INT64;

@Document
public class Table {

    @Positive
    @Id
    private Long number;

    private boolean taken;

    public Long getNumber() {
        return number;
    }

    public void setNumber(Long number) {
        this.number = number;
    }

    public boolean isTaken() {
        return taken;
    }

    public void setTaken(boolean taken) {
        this.taken = taken;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Table)) return false;
        Table table = (Table) o;
        return taken == table.taken && Objects.equals(number, table.number);
    }

    @Override
    public int hashCode() {
        return Objects.hash(number, taken);
    }
}
