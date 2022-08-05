package fr.univcotedazur.menus.repositories;

import fr.univcotedazur.menus.models.MenuItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface MenuItemRepository extends MongoRepository<MenuItem, UUID> {

        Optional<MenuItem> findByShortName(@Param("shortname") String shortName);

}
