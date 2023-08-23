package fr.univcotedazur.dining.repositories;

import fr.univcotedazur.dining.models.OrderingLine;
import fr.univcotedazur.dining.models.Preparation;
import fr.univcotedazur.dining.models.TableOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public class TableOrderRepositoryCustomImpl implements TableOrderRepositoryCustom {

    private final MongoOperations mongoOperations;

    @Autowired
    public TableOrderRepositoryCustomImpl(MongoOperations mongoOperations) {
        this.mongoOperations = mongoOperations;
    }

    public TableOrder addAndSaveTableOrderLine(UUID tableOrderId, OrderingLine line) {
        return mongoOperations.findAndModify(
                Query.query(Criteria.where("id").is(tableOrderId)),
                new Update().push("lines", line),
                FindAndModifyOptions.options().returnNew(true),
                TableOrder.class);
    }

    @Override
    public synchronized TableOrder sendForPrepAndSaveTableOrder(UUID tableOrderId, List<OrderingLine> linesToSent, List<Preparation> preparations) {
        for (OrderingLine orderingLine : linesToSent) {
            mongoOperations.findAndModify(
                    Query.query(new Criteria().andOperator(
                            Criteria.where("id").is(tableOrderId),
                            Criteria.where("lines").elemMatch(Criteria.where("item").is(orderingLine.getItem())),
                            Criteria.where("lines").elemMatch(Criteria.where("howMany").is(orderingLine.getHowMany())))),
                    new Update().set("lines.$.sentForPreparation", true),
                    FindAndModifyOptions.options().returnNew(true),
                    TableOrder.class);
        }
        return mongoOperations.findAndModify(
                Query.query(Criteria.where("id").is(tableOrderId)),
                new Update().set("preparations", preparations),
                FindAndModifyOptions.options().returnNew(true),
                TableOrder.class);
    }

}
