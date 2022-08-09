package fr.univcotedazur.kitchen.repositories;

import fr.univcotedazur.kitchen.models.CookedItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface CookedItemRepository extends MongoRepository<CookedItem, UUID> {

    @Query(value = "{ 'takenForService' : { $exists: false}, 'readyToServe' : {$lt : ?0  } }")
    List<CookedItem> findReadyToBeServedCookedItems(LocalDateTime readyTime);

    @Query(value = "{ 'takenForService' : { $exists: false}, 'readyToServe' : {$gte : ?0  } }")
    List<CookedItem> findReadyPreparationStartedCookedItems(LocalDateTime readyTime);

}
