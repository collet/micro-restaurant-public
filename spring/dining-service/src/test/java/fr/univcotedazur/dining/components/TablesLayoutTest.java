package fr.univcotedazur.dining.components;

import fr.univcotedazur.dining.repositories.TableRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.junit.jupiter.MockitoSettings;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

@SpringBootTest
class TablesLayoutTest {

    @MockBean
    TableRepository tableRepository;

    @Test
    void addTableWithSuccess() {
        // when(tableRepository.findByNumber(anyLong()).thenReturn()
    }
}