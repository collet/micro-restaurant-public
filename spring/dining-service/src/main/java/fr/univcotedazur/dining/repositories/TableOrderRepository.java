package fr.univcotedazur.dining.repositories;

import fr.univcotedazur.dining.models.OrderingLine;
import fr.univcotedazur.dining.models.Table;
import fr.univcotedazur.dining.models.TableOrder;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TableOrderRepository extends MongoRepository<TableOrder, String> {

    @Query(value = "{ 'table' : ?0 }")
    Optional<TableOrder> findByTable(Table table);

    @Query(value = "{ 'billed' : { $exists: false} }")
    List<TableOrder> findOpenTableOrders();

}
