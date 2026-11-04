package com.sacredjourney.backend;

import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/journey")
public class JourneyController {
    private final AtomicReference<JourneyProfile> profile = new AtomicReference<>(JourneyProfile.initial());

    @GetMapping
    public JourneyProfile getJourney() {
        return profile.get();
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok", "service", "sacred-journey-api");
    }

    @PostMapping("/plan")
    public ResponseEntity<JourneyProfile> savePlan(@RequestBody PlanRequest request) {
        JourneyProfile current = profile.get();
        profile.set(new JourneyProfile(current.name(), current.completedAt(), current.place(),
                request.nextPlan(), request.nextPlanNote(), current.goals()));
        return ResponseEntity.ok(profile.get());
    }

    public record PlanRequest(String nextPlan, String nextPlanNote) {}

    public record JourneyProfile(String name, String completedAt, String place, String nextPlan,
            String nextPlanNote, List<Goal> goals) {
        static JourneyProfile initial() {
            return new JourneyProfile("Raj", "6 July 2026", "Tirumala (Tirupati)", "Srisailam",
                    "Next destination to plan", List.of(
                            new Goal("12 Jyotirlingas", 0, 12, "saffron"),
                            new Goal("Panch Kedar", 0, 5, "forest"),
                            new Goal("Char Dham", 0, 4, "sky"),
                            new Goal("Panch Kailash", 0, 5, "plum"),
                            new Goal("Tirumala (Tirupati)", 1, 1, "gold")));
        }
    }

    public record Goal(String name, int completed, int total, String accent) {}
}