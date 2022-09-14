package fr.univcotedazur.kitchen.repositories;

import fr.univcotedazur.kitchen.models.Preparation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PreparationRepository extends MongoRepository<Preparation, UUID> {

    @Query(value = "{ 'completedAt' : { $exists: false} }")
    List<Preparation> findAllPreparationsNotReady();

    @Query(value = "{ 'completedAt' : { $exists: true}, 'takenForServiceAt' : { $exists: false} }")
    List<Preparation> findPreparationsReadyAndNotTaken();

    @Query(value = "{ 'tableId' : ?0, 'completedAt' : { $exists: true}, 'takenForServiceAt' : { $exists: false} }")
    List<Preparation> findPreparationsReadyAndNotTakenForTable(Long tableId);

    @Query(value = "{ 'tableId' : ?0, 'completedAt' : { $exists: false} }")
    List<Preparation> findPreparationsNotReadyForTable(Long tableId);

}
