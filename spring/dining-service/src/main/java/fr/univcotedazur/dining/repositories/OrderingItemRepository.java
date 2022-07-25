package fr.univcotedazur.dining.repositories;

import fr.univcotedazur.dining.models.OrderingItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderingItemRepository extends MongoRepository<OrderingItem, String> {

    Optional<OrderingItem> findByShortName(String shortName);

}

