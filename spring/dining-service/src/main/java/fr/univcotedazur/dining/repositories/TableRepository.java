package fr.univcotedazur.dining.repositories;

import fr.univcotedazur.dining.models.Table;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TableRepository extends MongoRepository<Table, Long> {

    Optional<Table> findByNumber(Long number);

    @Query(value = "{ 'taken' : false }")
    List<Table> findOpenTables();

}
