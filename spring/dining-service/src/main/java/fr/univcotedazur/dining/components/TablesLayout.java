package fr.univcotedazur.dining.components;

import fr.univcotedazur.dining.exceptions.AlreadyExistingTableException;
import fr.univcotedazur.dining.exceptions.TableAlreadyTakenException;
import fr.univcotedazur.dining.models.Table;
import fr.univcotedazur.dining.repositories.TableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class TablesLayout { // No actual layout here, just the repo for the tables, but a layout for decomposition upon waiters would be there

    @Autowired
    private TableRepository tableRepository;

    public Table addTable(Long number) throws AlreadyExistingTableException {
        if (isValidTable(number)) {
            throw new AlreadyExistingTableException(number);
        } else {
            Table newTable = new Table();
            newTable.setNumber(number);
            return tableRepository.save(newTable);
        }
    }

    public boolean isValidTable(Long number) {
        return tableRepository.existsById(number);
    }

    public Table takeTable(Table table) throws TableAlreadyTakenException {
        if (table.isTaken()) {
            throw new TableAlreadyTakenException(table.getNumber());
        } else {
            table.setTaken(true);
            return tableRepository.save(table);
        }
    }

    public Table freeTable(Table table) {
        table.setTaken(false);
        return tableRepository.save(table);
    }

    public Optional<Table> findByNumber(Long number) {
        return tableRepository.findByNumber(number);
    }

    public List<Table> findAll() {
        return tableRepository.findAll();
    }

}
