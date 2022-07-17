package fr.univcotedazur.menu.repositories;

import fr.univcotedazur.menu.models.MenuItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(collectionResourceRel = "menus", path = "menus")
public interface MenuItemRepository extends MongoRepository<MenuItem, String> {

        List<MenuItem> findByShortName(@Param("shortname") String shortName);

}
