package com.sacredjourney.backend;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface StoredMemoryRepository extends JpaRepository<StoredMemory, String> {
    List<StoredMemory> findAllByOrderByCreatedAtAsc();
}
