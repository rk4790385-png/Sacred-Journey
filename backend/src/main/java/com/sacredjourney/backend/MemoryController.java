package com.sacredjourney.backend;

import java.io.IOException;
import java.util.List;

import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/memories")
public class MemoryController {
    private final StoredMemoryRepository memories;

    public MemoryController(StoredMemoryRepository memories) {
        this.memories = memories;
    }

    @GetMapping
    public List<MemoryResponse> getMemories() {
        return memories.findAllByOrderByCreatedAtAsc().stream()
                .map(MemoryResponse::from)
                .toList();
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getImage(@PathVariable String id) {
        StoredMemory memory = memories.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(memory.getContentType()))
                .cacheControl(CacheControl.noCache())
                .body(memory.getImageData());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MemoryResponse> saveMemory(
            @RequestParam String id,
            @RequestParam String circuitId,
            @RequestParam String locationId,
            @RequestParam String caption,
            @RequestParam("file") MultipartFile file) throws IOException {
        if (id.isBlank() || id.length() > 120 || circuitId.isBlank()
                || circuitId.length() > 100 || locationId.isBlank()
                || locationId.length() > 100 || caption.length() > 255) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid photo details.");
        }
        if (file.isEmpty() || file.getContentType() == null
                || !file.getContentType().toLowerCase().startsWith("image/")
                || "image/svg+xml".equalsIgnoreCase(file.getContentType())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A supported image is required.");
        }

        StoredMemory existing = memories.findById(id).orElse(null);
        if (existing != null) {
            if (!existing.getCircuitId().equals(circuitId)
                    || !existing.getLocationId().equals(locationId)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Photo ID already exists.");
            }
            return ResponseEntity.ok(MemoryResponse.from(existing));
        }

        StoredMemory memory = memories.saveAndFlush(new StoredMemory(
                id,
                circuitId,
                locationId,
                caption,
                file.getContentType(),
                file.getBytes()));
        return ResponseEntity.status(HttpStatus.CREATED).body(MemoryResponse.from(memory));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMemory(@PathVariable String id) {
        if (!memories.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        memories.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    public record MemoryResponse(
            String id,
            String circuitId,
            String locationId,
            String caption,
            String imageUrl) {
        static MemoryResponse from(StoredMemory memory) {
            return new MemoryResponse(
                    memory.getId(),
                    memory.getCircuitId(),
                    memory.getLocationId(),
                    memory.getCaption(),
                    "/api/memories/" + memory.getId() + "/image");
        }
    }
}
