package com.sacredjourney.backend;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "travel_memories")
public class StoredMemory {
    @Id
    @Column(length = 120)
    private String id;

    @Column(name = "circuit_id", nullable = false, length = 100)
    private String circuitId;

    @Column(name = "location_id", nullable = false, length = 100)
    private String locationId;

    @Column(nullable = false, length = 255)
    private String caption;

    @Column(name = "content_type", nullable = false, length = 100)
    private String contentType;

    @Lob
    @Column(name = "image_data", nullable = false)
    private byte[] imageData;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected StoredMemory() {}

    public StoredMemory(
            String id,
            String circuitId,
            String locationId,
            String caption,
            String contentType,
            byte[] imageData) {
        this.id = id;
        this.circuitId = circuitId;
        this.locationId = locationId;
        this.caption = caption;
        this.contentType = contentType;
        this.imageData = imageData;
        this.createdAt = Instant.now();
    }

    public String getId() {
        return id;
    }

    public String getCircuitId() {
        return circuitId;
    }

    public String getLocationId() {
        return locationId;
    }

    public String getCaption() {
        return caption;
    }

    public String getContentType() {
        return contentType;
    }

    public byte[] getImageData() {
        return imageData;
    }
}
