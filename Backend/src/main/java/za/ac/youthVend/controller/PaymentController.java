package za.ac.youthVend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.ac.youthVend.domain.Order;
import za.ac.youthVend.domain.PaymentTransaction;
import za.ac.youthVend.dto.CreatePaymentRequest;
import za.ac.youthVend.service.OrderService;
import za.ac.youthVend.service.PaymentTransactionService;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class PaymentController {

    private final PaymentTransactionService paymentService;
    private final OrderService orderService;

    /**
     * Get all payment transactions
     */
    @GetMapping
    public ResponseEntity<List<PaymentTransaction>> getAllPayments() {
        List<PaymentTransaction> payments = paymentService.findAll();
        return ResponseEntity.ok(payments);
    }

    /**
     * Get payment by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<PaymentTransaction> getPaymentById(@PathVariable Integer id) {
        Optional<PaymentTransaction> paymentOpt = paymentService.findById(id);
        return paymentOpt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new payment transaction
     */
    @PostMapping
    public ResponseEntity<PaymentTransaction> createPayment(@RequestBody CreatePaymentRequest request) {
        // Fetch the order by ID
        Order order = orderService.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        // Create the PaymentTransaction
        PaymentTransaction payment = new PaymentTransaction();
        payment.setOrder(order);
        payment.setAmount(request.getAmount());
        payment.setProvider(request.getProvider());
        payment.setStatus(request.getStatus());
        
        PaymentTransaction created = paymentService.save(payment);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Update payment transaction
     */
    @PutMapping("/{id}")
    public ResponseEntity<PaymentTransaction> updatePayment(@PathVariable Integer id,
                                                            @RequestBody PaymentTransaction payment) {
        payment.setPaymentId(id);
        PaymentTransaction updated = paymentService.update(payment);
        return ResponseEntity.ok(updated);
    }

    /**
     * Delete payment transaction
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Integer id) {
        if (!paymentService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        paymentService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get payments by order (optional, using service findByOrder)
     */
    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<PaymentTransaction>> getPaymentsByOrder(@PathVariable Integer orderId) {
        Order order = new Order();
        order.setOrderId(orderId);

        Optional<PaymentTransaction> paymentOpt = paymentService.findByOrder(order);
        return paymentOpt.map(payment -> ResponseEntity.ok(List.of(payment)))
                .orElse(ResponseEntity.notFound().build());
    }
}
