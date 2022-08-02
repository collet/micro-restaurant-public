package fr.univcotedazur.dining.controllers;

import fr.univcotedazur.dining.components.TablesLayout;
import fr.univcotedazur.dining.controllers.dto.TableCreationDTO;
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

    @PostMapping()
    public ResponseEntity<Table> createTable(@RequestBody @Valid TableCreationDTO tableCreationDTO) throws TableAlreadyExistingException {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(tablesLayout.addTable(tableCreationDTO.getTableId()));
    }

    @GetMapping
    public ResponseEntity<List<Table>> listAllTables() {
        return ResponseEntity.ok(tablesLayout.findAll());
    }

    @GetMapping(path="/{tableId}")
    public ResponseEntity<Table> findTableByNumber(@PathVariable("tableId") Long tableId) throws TableIdNotFoundException {
        return ResponseEntity.ok(tablesLayout.retrieveTable(tableId));
    }

}
