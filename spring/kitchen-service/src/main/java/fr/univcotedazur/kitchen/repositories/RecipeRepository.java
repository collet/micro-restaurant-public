package fr.univcotedazur.kitchen.repositories;

import fr.univcotedazur.kitchen.models.Recipe;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface RecipeRepository extends MongoRepository<Recipe, String> {

}
