package fr.univcotedazur.dining.components;

import fr.univcotedazur.dining.exceptions.TableAlreadyExistingException;
import fr.univcotedazur.dining.models.Table;
import fr.univcotedazur.dining.repositories.TableRepository;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

@SpringBootTest
class TablesLayoutTest {

    @MockBean
    TableRepository tableRepository;

    @Autowired
    TablesLayout tablesLayout;

    @Test
    void addTableWithSuccess() throws Exception {
        // No need to mock, false is default : when(tableRepository.existsById(anyLong())).thenReturn(false);
        Table mock1 = new Table();
        mock1.setNumber(1L);
        when(tableRepository.save(ArgumentMatchers.any(Table.class))).thenReturn(mock1);
        assertThat(tablesLayout.addTable(1L),equalTo(mock1));
    }

    @Test
    void addTableWithExceptionWhenTableAlreadyExists() throws Exception {
        when(tableRepository.existsById(anyLong())).thenReturn(true);
        assertThrows(TableAlreadyExistingException.class, () -> tablesLayout.addTable(1L));
    }

}