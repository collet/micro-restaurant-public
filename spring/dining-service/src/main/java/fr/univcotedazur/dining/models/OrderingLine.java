package fr.univcotedazur.dining.models;

import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.Positive;
import java.util.Objects;

public class OrderingLine {

    private OrderingItem item;

    @Positive
    private int howMany;

    private boolean sentForPreparation;

    public OrderingItem getItem() {
        return item;
    }

    public void setItem(OrderingItem item) {
        this.item = item;
    }

    public int getHowMany() {
        return howMany;
    }

    public void setHowMany(int howMany) {
        this.howMany = howMany;
    }

    public boolean isSentForPreparation() {
        return sentForPreparation;
    }

    public void setSentForPreparation(boolean sentForPreparation) {
        this.sentForPreparation = sentForPreparation;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof OrderingLine)) return false;
        OrderingLine that = (OrderingLine) o;
        return howMany == that.howMany && sentForPreparation == that.sentForPreparation && Objects.equals(item, that.item);
    }

    @Override
    public int hashCode() {
        return Objects.hash(item, howMany, sentForPreparation);
    }
}
