package fr.univcotedazur.dining;

import fr.univcotedazur.dining.components.MenuProxy;
import fr.univcotedazur.dining.components.TablesLayout;
import fr.univcotedazur.dining.models.OrderingItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.List;

@ConditionalOnProperty(
        prefix = "application.runner",
        value = "enabled",
        havingValue = "true",
        matchIfMissing = true)
@Component
public class DiningStartUpLogic implements ApplicationRunner {

    @Autowired
    TablesLayout tablesLayout;

    @Autowired
    MenuProxy menuProxy;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (tablesLayout.findAll().size() == 0) { // in case of container restart, mongodb will be already populated
            tablesLayout.addTable(1L);
            tablesLayout.addTable(2L);
            tablesLayout.addTable(3L);
        }
    }


}
