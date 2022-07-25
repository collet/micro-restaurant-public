package fr.univcotedazur.dining.models;

import javax.validation.constraints.Positive;

public class OrderingLine {

    private OrderingItem item;

    @Positive
    private int howMany;

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
}
