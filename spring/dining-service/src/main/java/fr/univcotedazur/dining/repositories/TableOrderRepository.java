package fr.univcotedazur.dining.repositories;

import fr.univcotedazur.dining.models.TableOrder;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TableOrderRepository extends MongoRepository<TableOrder, String> {

}
