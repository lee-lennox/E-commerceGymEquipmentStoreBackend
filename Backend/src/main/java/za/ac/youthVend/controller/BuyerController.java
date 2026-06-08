package za.ac.youthVend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import za.ac.youthVend.domain.User;
import za.ac.youthVend.service.UserService;

import java.util.Optional;

@RestController
@RequestMapping("/buyer")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@PreAuthorize("hasAnyAuthority('BUYER', 'ADMIN')")
public class BuyerController {

    private final UserService userService;

    public BuyerController(UserService userService) {
        this.userService = userService;
    }

    // =========================
    // GET BUYER PROFILE
    // =========================
    @GetMapping("/profile/{id}")
    public ResponseEntity<User> getProfile(@PathVariable Integer id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
