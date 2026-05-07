package com.reservas.parqueaderos.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "favoritos")
public class Favorito {

    @Id
    private String id;

    private Long userId;
    private Long productoId;
    private LocalDateTime fechaCreacion;
}
