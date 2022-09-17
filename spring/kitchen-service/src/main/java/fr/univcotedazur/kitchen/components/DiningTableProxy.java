package fr.univcotedazur.kitchen.components;

import fr.univcotedazur.kitchen.components.dto.TableDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Stream;

@Component
public class DiningTableProxy {

    @Value("${dining.host.baseurl:}")
    private String diningHostandPort;

    private RestTemplate restTemplate = new RestTemplate();

    private List<Long> tableIdList;

    public List<Long> findAll() {
        populateTableIdListIfNeeded();
        return new ArrayList<>(tableIdList);
    }

    public boolean isTableIdValid(Long tableId) {
        populateTableIdListIfNeeded();
        return tableIdList.contains(tableId);
    }

    private void populateTableIdListIfNeeded() {
        System.err.println("###################### acessing dining (tables) from the kitchen service #################");
        if (tableIdList == null) {
            TableDTO[] tables = restTemplate.getForEntity(diningHostandPort +"/tables", TableDTO[].class).getBody();
            tableIdList = Stream.of(tables).map(TableDTO::getNumber).toList();
        }
    }
}
