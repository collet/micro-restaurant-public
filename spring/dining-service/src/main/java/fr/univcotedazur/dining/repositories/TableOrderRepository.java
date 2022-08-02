package fr.univcotedazur.dining.repositories;

import fr.univcotedazur.dining.models.Table;
import fr.univcotedazur.dining.models.TableOrder;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TableOrderRepository extends MongoRepository<TableOrder, UUID> {

    @Query(value = "{ 'tableNumber' : ?0 }") // We don't use Table, as a table object can be taken or not in the mongoDB collections
    List<TableOrder> findByTableNumber(Long tableNumber);

    @Query(value = "{ 'billed' : { $exists: false} }")
    List<TableOrder> findOpenTableOrders();

}
