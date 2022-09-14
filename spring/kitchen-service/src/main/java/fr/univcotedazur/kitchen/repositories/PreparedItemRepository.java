package fr.univcotedazur.kitchen.repositories;

import fr.univcotedazur.kitchen.models.Post;
import fr.univcotedazur.kitchen.models.PreparedItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface PreparedItemRepository extends MongoRepository<PreparedItem, UUID> {

    @Query(value = "{ 'startedAt' : { $exists: true}, 'finishedAt' : { $exists: false} }")
    List<PreparedItem> findAllPreparedItemsStartedAndNotFinished();

    @Query(value = "{ 'finishedAt' : { $exists: true} }")
    List<PreparedItem> findAllPreparedItemsFinished();

    @Query(value = "{ 'recipe.post' : ?0, startedAt : { $exists: false}, 'shouldStartAt' : {$lte : ?1  } }")
    List<PreparedItem> findPreparedItemsThatShouldStartOnThePost(String postname, LocalDateTime readyTime);

}
