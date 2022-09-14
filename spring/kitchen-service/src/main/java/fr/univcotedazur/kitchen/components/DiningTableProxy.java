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
    private String diniongHostandPort;

    private RestTemplate restTemplate = new RestTemplate();

    private List<Long> tableIdList;

    public List<Long> findAll() {
        populateMenuItemMapIfNeeded();
        return new ArrayList<>(tableIdList);
    }

    public boolean isTableIdValid(Long tableId) {
        populateMenuItemMapIfNeeded();
        return tableIdList.contains(tableId);
    }

    private void populateMenuItemMapIfNeeded() {
        System.err.println("###################### acessing dining (tables) from the kitchen service #################");
        if (tableIdList == null) {
            TableDTO[] tables = restTemplate.getForEntity(diniongHostandPort+"/tables", TableDTO[].class).getBody();
                   tableIdList = Stream.of(tables).map(TableDTO::getNumber).toList();
        }
    }
}
