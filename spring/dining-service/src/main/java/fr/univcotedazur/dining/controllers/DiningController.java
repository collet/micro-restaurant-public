package fr.univcotedazur.dining.controllers;

import fr.univcotedazur.dining.components.DiningRoom;
import fr.univcotedazur.dining.components.MenuProxy;
import fr.univcotedazur.dining.components.TablesLayout;
import fr.univcotedazur.dining.controllers.dto.SentDTO;
import fr.univcotedazur.dining.controllers.dto.StartOrderingDTO;
import fr.univcotedazur.dining.controllers.dto.ItemDTO;
import fr.univcotedazur.dining.exceptions.*;
import fr.univcotedazur.dining.models.OrderingItem;
import fr.univcotedazur.dining.models.Table;
import fr.univcotedazur.dining.models.TableOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping(path = DiningController.BASE_URI, produces = APPLICATION_JSON_VALUE)
public class DiningController {

    public static final String BASE_URI = "/tableOrders";

    @Autowired
    private DiningRoom diningRoom;

    @Autowired
    private TablesLayout tablesLayout;

    @Autowired
    private MenuProxy menuProxy;

    @PostMapping
    public ResponseEntity<TableOrder> openTable(@RequestBody @Valid StartOrderingDTO startOrderingDTO)
            throws TableIdNotFoundException, TableAlreadyTakenException {
        Table table = tablesLayout.retrieveTable(startOrderingDTO.getTableId());
        return ResponseEntity.status(HttpStatus.CREATED).body(diningRoom.startOrderingOnTable(table, startOrderingDTO.getCustomersCount()));
    }

    @GetMapping
    public ResponseEntity<List<TableOrder>> findAllOpenTableOrders() {
        return ResponseEntity.ok(diningRoom.findAllOpenTableOrders());
    }

    @PostMapping("/{tableOrderId}")
    public ResponseEntity<TableOrder> addToTableOrder(@PathVariable("tableOrderId") UUID tableOrderId, @RequestBody ItemDTO itemDTO)
            throws TableOrderIdNotFoundException, TableOrderAlreadyBilledException, ItemDTONotFoundException {
        TableOrder tableOrder = diningRoom.retrieveTableOrder(tableOrderId);
        Optional<OrderingItem> orderingItemOpt =  menuProxy.findByShortName(itemDTO.getShortName());
        if (orderingItemOpt.isEmpty()) {
            throw new ItemDTONotFoundException(itemDTO);
        } else {
            OrderingItem orderingItem = orderingItemOpt.get();
            if (!orderingItem.getId().equals(itemDTO.getId())) {
                throw new ItemDTONotFoundException(itemDTO);
            } else {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(diningRoom.addNewItemOnTableOrder(tableOrder, orderingItem, itemDTO.getHowMany()));
            }
        }
    }

    @GetMapping("/{tableOrderId}")
    public ResponseEntity<TableOrder> tableOrder(@PathVariable("tableOrderId") UUID tableOrderId)
            throws TableOrderIdNotFoundException {
        return ResponseEntity.ok(diningRoom.retrieveTableOrder(tableOrderId));
    }

    @PostMapping("/{tableOrderId}/prepare")
    public ResponseEntity<SentDTO> prepare(@PathVariable("tableOrderId") UUID tableOrderId)
            throws TableOrderIdNotFoundException {
        TableOrder tableOrder = diningRoom.retrieveTableOrder(tableOrderId);
        SentDTO sentDTO = new SentDTO();
        sentDTO.setHowManyItemsSentForPreparation(diningRoom.sendItemsForPreparation(tableOrder));
        return ResponseEntity.ok(sentDTO);
    }

    @PostMapping("/{tableOrderId}/bill")
    public ResponseEntity<TableOrder> bill(@PathVariable("tableOrderId") UUID tableOrderId)
            throws TableOrderIdNotFoundException, TableOrderAlreadyBilledException {
        TableOrder tableOrder = diningRoom.retrieveTableOrder(tableOrderId);
        return ResponseEntity.ok(diningRoom.billOrderOnTable(tableOrder));
    }



}
