package fr.univcotedazur.dining.components;

import fr.univcotedazur.dining.models.Preparation;
import fr.univcotedazur.dining.controllers.dto.TableWithOrderDTO;
import fr.univcotedazur.dining.components.dto.ItemsToBeCookedInKitchenDTO;
import fr.univcotedazur.dining.exceptions.*;
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
import java.util.Optional;
import java.util.UUID;

@Component
public class DiningRoom {

    @Autowired
    private TableOrderRepository tableOrderRepository;

    @Autowired
    private TablesLayout tablesLayout;

    @Autowired
    private KitchenProxy kitchenProxy;

    public TableOrder startOrderingOnTable(Table table, int customerCount) throws TableAlreadyTakenException {
        Table takenTable = tablesLayout.takeTable(table);
        TableOrder tableOrder = new TableOrder();
        tableOrder.setId(UUID.randomUUID());
        tableOrder.setTableNumber(takenTable.getNumber());
        tableOrder.setCustomersCount(customerCount);
        tableOrder.setOpened(LocalDateTime.now());
        return tableOrderRepository.save(tableOrder);
    }

    public Optional<TableOrder> findById(UUID tableOrderId) {
        return tableOrderRepository.findById(tableOrderId);
    }

    public TableOrder retrieveTableOrder(UUID tableOrderId) throws TableOrderIdNotFoundException {
        Optional<TableOrder> optTableOrder = findById(tableOrderId);
        if (optTableOrder.isEmpty()) {
            throw new TableOrderIdNotFoundException(tableOrderId);
        }
        return optTableOrder.get();
    }

    public TableOrder currentTableOrderOnTable(Table table) throws TableNotTakenException {
        if (!table.isTaken()) {
            throw new TableNotTakenException(table.getNumber());
        } else {
            return tableOrderRepository.findOpenTableOrders().stream()
                    .filter(tOrder -> tOrder.getBilled() == null).findFirst().get();
        }
    }

    public TableWithOrderDTO tableWithOrderDTOFactory(Table table) {
        TableWithOrderDTO tableWithOrderDTO = new TableWithOrderDTO();
        tableWithOrderDTO.setNumber(table.getNumber());
        tableWithOrderDTO.setTaken(table.isTaken());
        try {
            tableWithOrderDTO.setTableOrderId(currentTableOrderOnTable(table).getId());
        } catch (TableNotTakenException e) {
            tableWithOrderDTO.setTableOrderId(null);
        }
        return tableWithOrderDTO;
    }

    public List<TableOrder> findAllOpenTableOrders() {
        return tableOrderRepository.findOpenTableOrders();
    }

    public List<TableOrder> findAll() {
        return tableOrderRepository.findAll();
    }

    public TableOrder billOrderOnTable(TableOrder tableOrder) throws TableOrderAlreadyBilledException, TableIdNotFoundException {
        if (tableOrder.getBilled() != null) {
            throw new TableOrderAlreadyBilledException(tableOrder.getTableNumber(), tableOrder.getId());
        } else {
            tableOrder.setBilled(LocalDateTime.now());
            System.err.println("TO BE IMPLEMENTED: send payment for the tableOrder" + tableOrder.getId() + " on table " +
                    tableOrder.getTableNumber());
            tablesLayout.freeTable(tablesLayout.retrieveTable(tableOrder.getTableNumber()));
            return tableOrderRepository.save(tableOrder);
        }
    }

    public TableOrder addNewItemOnTableOrder(TableOrder tableOrder, OrderingItem item, int howMany) throws TableOrderAlreadyBilledException {
        if (tableOrder.getBilled() != null) {
            throw new TableOrderAlreadyBilledException(tableOrder.getTableNumber(), tableOrder.getId());
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

    public List<Preparation> sendItemsForPreparation(TableOrder tableOrder) {
        List<OrderingLine> orderLines = tableOrder.getLines();
        List<Preparation> ongoingPreparations = kitchenProxy.sendCookingOrderToKitchen(orderLines.stream().
                filter(line -> !line.isSentForPreparation()).toList(),
                tableOrder.getTableNumber());
        tableOrder.setLines(allLinesAsPrepared(orderLines));
        List<Preparation> previousPreparations = tableOrder.getPreparations();
        if (previousPreparations == null) {
            previousPreparations = new ArrayList<>();
        }
        previousPreparations.addAll(ongoingPreparations);
        tableOrder.setPreparations(previousPreparations);
        tableOrderRepository.save(tableOrder);
        return ongoingPreparations;
    }

    private List<OrderingLine> allLinesAsPrepared(List<OrderingLine> input) {
        input.forEach(line -> line.setSentForPreparation(true));
        return input;
    }

}
