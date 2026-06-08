package za.ac.youthVend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.ac.youthVend.domain.CartItem;
import za.ac.youthVend.domain.User;
import za.ac.youthVend.service.CartItemService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class CartController {

    private final CartItemService cartItemService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CartItem>> getCartByUserId(@PathVariable Integer userId) {
        User user = new User();
        user.setUserId(userId);
        List<CartItem> cartItems = cartItemService.findByUser(user);
        return ResponseEntity.ok(cartItems);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CartItem> getCartItemById(@PathVariable Integer id) {
        Optional<CartItem> itemOpt = cartItemService.findById(id);
        return itemOpt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CartItem> addToCart(@RequestBody CartItem cartItem) {
        CartItem created = cartItemService.save(cartItem);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartItem> updateCartItem(@PathVariable Integer id, @RequestBody CartItem cartItem) {
        cartItem.setCartItemId(id);
        CartItem updated = cartItemService.update(cartItem);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Integer id) {
        if (!cartItemService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        cartItemService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> clearCart(@PathVariable Integer userId) {
        User user = new User();
        user.setUserId(userId);
        List<CartItem> userCartItems = cartItemService.findByUser(user);
        for (CartItem item : userCartItems) {
            cartItemService.deleteById(item.getCartItemId());
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}/total")
    public ResponseEntity<Double> getCartTotal(@PathVariable Integer userId) {
        User user = new User();
        user.setUserId(userId);
        List<CartItem> cartItems = cartItemService.findByUser(user);
        double total = cartItems.stream()
                .mapToDouble(item -> item.getProduct().getPrice().doubleValue() * item.getQuantity())
                .sum();
        return ResponseEntity.ok(total);
    }
}
