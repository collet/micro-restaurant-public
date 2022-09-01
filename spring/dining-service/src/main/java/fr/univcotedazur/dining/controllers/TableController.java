package fr.univcotedazur.dining.controllers;

import fr.univcotedazur.dining.components.DiningRoom;
import fr.univcotedazur.dining.components.TablesLayout;
import fr.univcotedazur.dining.controllers.dto.TableCreationDTO;
import fr.univcotedazur.dining.controllers.dto.TableWithOrderDTO;
import fr.univcotedazur.dining.exceptions.TableAlreadyExistingException;
import fr.univcotedazur.dining.exceptions.TableIdNotFoundException;
import fr.univcotedazur.dining.models.Table;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping(path = fr.univcotedazur.dining.controllers.TableController.BASE_URI, produces = APPLICATION_JSON_VALUE)
public class TableController {

    public static final String BASE_URI = "/tables";

    @Autowired
    private TablesLayout tablesLayout;

    @Autowired
    private DiningRoom diningRoom;

    @PostMapping()
    public ResponseEntity<TableWithOrderDTO> createTable(@RequestBody @Valid TableCreationDTO tableCreationDTO) throws TableAlreadyExistingException {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(diningRoom.tableWithOrderDTOFactory(tablesLayout.addTable(tableCreationDTO.getTableId())));
    }

    @GetMapping
    public ResponseEntity<List<TableWithOrderDTO>> listAllTables() {
        return ResponseEntity.ok(tablesLayout.findAll().stream().map(table -> diningRoom.tableWithOrderDTOFactory(table)).toList());
    }

    @GetMapping(path="/{tableId}")
    public ResponseEntity<TableWithOrderDTO> findTableByNumber(@PathVariable("tableId") Long tableId) throws TableIdNotFoundException {
        return ResponseEntity.ok(diningRoom.tableWithOrderDTOFactory(tablesLayout.retrieveTable(tableId)));
    }

}
