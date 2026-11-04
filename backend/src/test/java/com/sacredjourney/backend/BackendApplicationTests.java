package com.sacredjourney.backend;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.server.ResponseStatusException;

@SpringBootTest(properties = {
		"spring.datasource.url=jdbc:h2:mem:sacredjourney-test;DB_CLOSE_DELAY=-1",
		"spring.jpa.hibernate.ddl-auto=create-drop"
})
class BackendApplicationTests {

	@Autowired
	private MemoryController memoryController;

	@Test
	void contextLoads() {
	}

	@Test
	void photosRemainAvailableUntilExplicitlyDeleted() throws IOException {
		byte[] image = new byte[] { 1, 2, 3, 4 };
		MockMultipartFile upload = new MockMultipartFile(
				"file", "tirupati.png", "image/png", image);

		var saved = memoryController.saveMemory(
				"test-photo", "tirumala", "tirupati", "Tirupati", upload);

		assertThat(saved.getStatusCode()).isEqualTo(HttpStatus.CREATED);
		assertThat(memoryController.getMemories()).extracting(MemoryController.MemoryResponse::id)
				.contains("test-photo");
		assertThat(memoryController.getImage("test-photo").getBody()).isEqualTo(image);

		memoryController.deleteMemory("test-photo");
		assertThat(memoryController.getMemories()).isEmpty();
		assertThatThrownBy(() -> memoryController.getImage("test-photo"))
				.isInstanceOf(ResponseStatusException.class);
	}
}
