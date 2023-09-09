package fr.univcotedazur.dining.repositories;

import fr.univcotedazur.dining.models.OrderingLine;
import fr.univcotedazur.dining.models.Preparation;
import fr.univcotedazur.dining.models.TableOrder;

import java.util.List;
import java.util.UUID;

public interface TableOrderRepositoryCustom {

    public TableOrder addAndSaveTableOrderLine(UUID tableOrderId, OrderingLine line);

    public TableOrder sendForPrepAndSaveTableOrder(UUID tableOrderId, List<OrderingLine> linesToSent, List<Preparation> preparations);

}
