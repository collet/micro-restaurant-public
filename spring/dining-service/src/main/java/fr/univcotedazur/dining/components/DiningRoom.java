package fr.univcotedazur.dining.components;

import fr.univcotedazur.dining.exceptions.TableAlreadyTakenException;
import fr.univcotedazur.dining.exceptions.TableNotTakenException;
import fr.univcotedazur.dining.exceptions.TableOrderAlreadyBilled;
import fr.univcotedazur.dining.models.OrderingItem;
import fr.univcotedazur.dining.models.OrderingLine;
import fr.univcotedazur.dining.models.Table;
import fr.univcotedazur.dining.models.TableOrder;
import fr.univcotedazur.dining.repositories.TableOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DiningRoom {

    @Autowired
    private TableOrderRepository tableOrderRepository;

    @Autowired
    private TablesLayout tablesLayout;

    public TableOrder startOrderingOnTable(Table table, int customerCount) throws TableAlreadyTakenException {
        Table takenTable = tablesLayout.takeTable(table);
        TableOrder tableOrder = new TableOrder();
        tableOrder.setTableNumber(takenTable.getNumber());
        tableOrder.setCustomersCount(customerCount);
        tableOrder.setOpened(LocalDateTime.now());
        return tableOrderRepository.save(tableOrder);
    }

    public TableOrder currentTableOrderOnTable(Table table) throws TableNotTakenException {
        if (!table.isTaken()) {
            throw new TableNotTakenException(table.getNumber());
        } else {
            return tableOrderRepository.findOpenTableOrders().stream()
                    .filter(tOrder -> tOrder.getBilled() == null).findFirst().get();
        }
    }

    public TableOrder billOrderOnTable(TableOrder tableOrder) throws TableOrderAlreadyBilled {
        if (tableOrder.getBilled() != null) {
            throw new TableOrderAlreadyBilled(tableOrder.getTableNumber(), tableOrder.getId());
        } else {
            tableOrder.setBilled(LocalDateTime.now());
            System.err.println("TODO: send payment for the tableOrder" + tableOrder.getId() + " on table " +
                    tableOrder.getTableNumber());
            return tableOrderRepository.save(tableOrder);
        }
    }

    public TableOrder addNewItemOnTableOrder(TableOrder tableOrder, OrderingItem item, int howMany) throws TableOrderAlreadyBilled {
        if (tableOrder.getBilled() != null) {
            throw new TableOrderAlreadyBilled(tableOrder.getTableNumber(), tableOrder.getId());
        } else {
            OrderingLine line = new OrderingLine();
            line.setItem(item);
            line.setHowMany(howMany);
            List<OrderingLine> lines = tableOrder.getLines();
            if (lines == null) {
                lines = new ArrayList<>();
            }
            // we don't try to merge lines on same items, as their can be "sent for preparation" at different moments
            lines.add(line);
            tableOrder.setLines(lines);
            return tableOrderRepository.save(tableOrder);
        }
    }

    public int sendItemsForPreparation(TableOrder tableOrder) {
        int howManyItemsSent = 0;
        ArrayList<OrderingLine> updatedLines = new ArrayList<>();
        for (OrderingLine line : tableOrder.getLines()) {
            if (!line.isSentForPreparation()) {
                howManyItemsSent += line.getHowMany();
                System.err.println("TODO: send " + line.getHowMany() + " " + line.getItem().getShortName() +
                        " to the right proxy component to kitchen or bar");
                line.setSentForPreparation(true);
            }
            updatedLines.add(line);
        }
        tableOrder.setLines(updatedLines);
        tableOrderRepository.save(tableOrder);
        return howManyItemsSent;
    }

}
