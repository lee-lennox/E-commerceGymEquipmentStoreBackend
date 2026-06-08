package za.ac.youthVend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.ac.youthVend.domain.Order;
import za.ac.youthVend.domain.OrderItem;
import za.ac.youthVend.domain.Product;
import za.ac.youthVend.dto.CreateOrderItemRequest;
import za.ac.youthVend.service.OrderItemService;
import za.ac.youthVend.service.OrderService;
import za.ac.youthVend.service.ProductService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/order-items")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class OrderItemController {

    private final OrderItemService orderItemService;
    private final OrderService orderService;
    private final ProductService productService;

    /**
     * Get all order items
     */
    @GetMapping
    public ResponseEntity<List<OrderItem>> getAllOrderItems() {
        List<OrderItem> orderItems = orderItemService.findAll();
        return ResponseEntity.ok(orderItems);
    }

    /**
     * Get order item by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrderItem> getOrderItemById(@PathVariable Integer id) {
        Optional<OrderItem> orderItemOpt = orderItemService.findById(id);
        return orderItemOpt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get all items for a specific order
     */
    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<OrderItem>> getOrderItemsByOrderId(@PathVariable Integer orderId) {
        List<OrderItem> orderItems = orderItemService.findAll().stream()
                .filter(item -> item.getOrder() != null && item.getOrder().getOrderId().equals(orderId))
                .toList();
        return ResponseEntity.ok(orderItems);
    }

    /**
     * Create new order item
     */
    @PostMapping
    public ResponseEntity<OrderItem> createOrderItem(@RequestBody CreateOrderItemRequest request) {
        // Fetch the order and product by their IDs
        Order order = orderService.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        Product product = productService.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        // Check if enough stock is available
        if (product.getStock() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock. Available: " + product.getStock());
        }
        
        // Decrease product stock
        product.setStock(product.getStock() - request.getQuantity());
        productService.update(product);
        
        // Create the OrderItem
        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(order);
        orderItem.setProduct(product);
        orderItem.setQuantity(request.getQuantity());
        orderItem.setUnitPrice(request.getPrice());
        
        OrderItem created = orderItemService.save(orderItem);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Update order item
     */
    @PutMapping("/{id}")
    public ResponseEntity<OrderItem> updateOrderItem(
            @PathVariable Integer id,
            @RequestBody OrderItem orderItem) {
        orderItem.setOrderItemId(id);
        OrderItem updated = orderItemService.update(orderItem);
        return ResponseEntity.ok(updated);
    }

    /**
     * Delete order item
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderItem(@PathVariable Integer id) {
        if (!orderItemService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        orderItemService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
