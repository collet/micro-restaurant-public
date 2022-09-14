package fr.univcotedazur.kitchen.components;

import fr.univcotedazur.kitchen.exceptions.PreparationIdNotFoundException;
import fr.univcotedazur.kitchen.models.*;
import fr.univcotedazur.kitchen.exceptions.RecipeNotFoundException;
import fr.univcotedazur.kitchen.repositories.PreparationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Stream;

@Component
public class KitchenFacade {

    @Autowired
    CookingPost cookingPost;

    @Autowired
    PreparationRepository preparationRepository;

    public List<Preparation> receivePreparationRequest(Long tableId, List<ItemsToBeCooked> itemsToBeCookedList) {
        List<ItemsToBeCooked> barInputList = new ArrayList<>();
        List<ItemsToBeCooked> coldInputList = new ArrayList<>();
        List<ItemsToBeCooked> hotInputList = new ArrayList<>();
        for(ItemsToBeCooked items: itemsToBeCookedList) {
            switch (getRecipeFromItemNameWithShortCut(items).getPost()) {
                case BAR:
                    barInputList.add(items); break;
                case COLD_DISH:
                    coldInputList.add(items); break;
                case HOT_DISH:
                    hotInputList.add(items); break;
            }
        }
        List<Preparation> returnedBodyList = new ArrayList<>();
        int maxTime;
        if (barInputList.size() > 0) {
            maxTime = computeMaxCookingTimeWithRecipeOptShortCut(barInputList);
            returnedBodyList.add(preparationFactory(tableId, LocalDateTime.now().plusSeconds(maxTime), startProcessOnItems(barInputList,maxTime)));
        }
        if ((coldInputList.size()+hotInputList.size()) > 0) {
            maxTime = computeMaxCookingTimeWithRecipeOptShortCut(
                    Stream.concat(coldInputList.stream(), hotInputList.stream()).toList());
            if (coldInputList.size() > 0) {
                returnedBodyList.add(preparationFactory(tableId, LocalDateTime.now().plusSeconds(maxTime), startProcessOnItems(coldInputList, maxTime)));
            }
            if (hotInputList.size() > 0) {
                returnedBodyList.add(preparationFactory(tableId, LocalDateTime.now().plusSeconds(maxTime), startProcessOnItems(hotInputList, maxTime)));
            }
        }
        return returnedBodyList;
    }

    public List<Preparation> allPreparationsReady() {
        return preparationRepository.findPreparationsReadyAndNotTaken();
    }

    public List<Preparation> allPreparationsNotReady() {
        return preparationRepository.findAllPreparationsNotReady();
    }

    public List<Preparation> allPreparationsReadyForTable(Long tableId) {
        return preparationRepository.findPreparationsReadyAndNotTakenForTable(tableId);
    }

    public List<Preparation> allPreparationsNotReadyForTable(Long tableId) {
        return preparationRepository.findPreparationsNotReadyForTable(tableId);
    }

    public Optional<Preparation> findById(UUID preparationId) {
        return preparationRepository.findById(preparationId);
    }

    public Optional<Preparation>  findPreparationRelatedToNotReadySpecificItem(PreparedItem preparedItem) {
        return allPreparationsNotReady().stream().filter(preparation ->
                        preparation.getPreparedItems().stream().anyMatch(preparedItem1 ->
                                preparedItem1.getId().equals(preparedItem.getId())))
                .findFirst();
    }

    public Preparation retrievePreparation(UUID preparationId) throws PreparationIdNotFoundException {
        Optional<Preparation> preparationOpt = findById(preparationId);
        if (preparationOpt.isEmpty()) {
            throw new PreparationIdNotFoundException(preparationId);
        }
        return preparationOpt.get();
    }

    public Preparation takeReadyPreparation(Preparation preparation) {
        if (allPreparationsReady().stream().noneMatch(prep -> prep.getId().equals(preparation.getId()))) {
            throw new IllegalArgumentException("The preparation " + preparation.getId() + " should be ready to be taken");
        }
        preparation.setTakenForServiceAt(LocalDateTime.now());
        return preparationRepository.save(preparation);
    }

    public void updateOnStartedPreparedItem(PreparedItem preparedItem) {
        if (preparedItem.getStartedAt() == null) {
            throw new IllegalArgumentException("The preparedItem " + preparedItem.getId() + "should have a StartedAt date");
        }
        Optional<Preparation> preparationOpt = findPreparationRelatedToNotReadySpecificItem(preparedItem);
        if (preparationOpt.isEmpty()) {
            throw new IllegalStateException("The preparedItem " + preparedItem.getId() + "should be attached to a Preparation");
        }
        Preparation preparation = preparationOpt.get();
        List<PreparedItem> updatedList = preparation.getPreparedItems();
        updatedList.removeIf(prepItem -> prepItem.getId().equals(preparedItem.getId()));
        updatedList.add(preparedItem);
        preparation.setPreparedItems(updatedList);
        preparationRepository.save(preparation);
    }

    public void updateOnFinishedPreparedItem(PreparedItem preparedItem) {
        if (preparedItem.getFinishedAt() == null) {
            throw new IllegalArgumentException("The preparedItem " + preparedItem.getId() + "should have a FinishedAt date");
        }
        Optional<Preparation> preparationOpt = findPreparationRelatedToNotReadySpecificItem(preparedItem);
        if (preparationOpt.isEmpty()) {
            throw new IllegalStateException("The preparedItem " + preparedItem.getId() + "should be attached to a Preparation");
        }
        Preparation preparation = preparationOpt.get();
        List<PreparedItem> updatedList = preparation.getPreparedItems();
        updatedList.removeIf(prepItem -> prepItem.getId().equals(preparedItem.getId()));
        updatedList.add(preparedItem);
        if (updatedList.stream().allMatch(prepItem -> (prepItem.getFinishedAt() != null))) {
            preparation.setCompletedAt(preparedItem.getFinishedAt());
        }
        preparation.setPreparedItems(updatedList);
        preparationRepository.save(preparation);
    }

    private Preparation preparationFactory(Long tableId, LocalDateTime shouldBeReadyAt, List<PreparedItem> preparedItemList) {
        Preparation preparation = new Preparation();
        preparation.setId(UUID.randomUUID());
        preparation.setTableId(tableId);
        preparation.setShouldBeReadyAt(shouldBeReadyAt);
        preparation.setPreparedItems(preparedItemList);
        preparationRepository.save(preparation);
        return preparation;
    }

    private List<PreparedItem> startProcessOnItems(List<ItemsToBeCooked> itemsToBeCookedList, int maxPreparationTime) throws RecipeNotFoundException {
        List<PreparedItem> preparedItemList = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        for (ItemsToBeCooked items : itemsToBeCookedList) {
            for (int i = 0; i < items.getHowMany(); i++) {
                preparedItemList.add(cookingPost.startCookingProcess(items.getShortName(), now.plusSeconds(maxPreparationTime)));
            }
        }
        return preparedItemList;
    }

    private Recipe getRecipeFromItemNameWithShortCut(ItemsToBeCooked itemsToBeCooked) {
        return cookingPost.getRecipeFromItemName(itemsToBeCooked.getShortName()).get();
    }

    private int computeMaxCookingTimeWithRecipeOptShortCut(List<ItemsToBeCooked> itemsToBeCookedList) {
        Stream<Recipe> recipesToBeUsed = itemsToBeCookedList.stream()
                .map(itemsToBeCooked -> getRecipeFromItemNameWithShortCut(itemsToBeCooked))
                .distinct();
        return recipesToBeUsed.map(recipe -> recipe.getMeanCookingTimeInSec()).max(Integer::compare).get();
    }

}
