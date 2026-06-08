package za.ac.youthVend.factory;

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import za.ac.youthVend.domain.Order;
import za.ac.youthVend.domain.OrderItem;
import za.ac.youthVend.domain.Product;
import za.ac.youthVend.domain.User;
import za.ac.youthVend.domain.enums.OrderStatus;
import za.ac.youthVend.domain.enums.UserRole;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class OrderFactoryTest {

    private User createTestUser() {
        return UserFactory.createUser("Test User", "test@example.com", "password123", UserRole.BUYER);
    }

    private Product createTestProduct() {
        return Product.builder()
                .name("Test Product")
                .description("A test product")
                .price(new BigDecimal("100.00"))
                .build();
    }

    private OrderItem createTestOrderItem(Product product) {
        return OrderItem.builder()
                .product(product)
                .quantity(2)
                .unitPrice(product.getPrice())
                .build();
    }

    @Test
    @org.junit.jupiter.api.Order(1)
    void createOrder_WithValidData() {
        User user = createTestUser();
        Product product = createTestProduct();
        OrderItem item = createTestOrderItem(product);
        BigDecimal totalAmount = new BigDecimal("200.00");

        Order order = OrderFactory.createOrder(user, List.of(item), totalAmount, OrderStatus.NEW);

        assertNotNull(order);
        assertEquals(user, order.getUser());
        assertEquals(1, order.getOrderItems().size());
        assertEquals(totalAmount, order.getTotalAmount());
        assertEquals(OrderStatus.NEW, order.getStatus());
    }

    @Test
    @org.junit.jupiter.api.Order(2)
    void createNewOrder_ShouldDefaultStatusToNew() {
        User user = createTestUser();
        Product product = createTestProduct();
        OrderItem item = createTestOrderItem(product);
        BigDecimal totalAmount = new BigDecimal("200.00");

        Order order = OrderFactory.createNewOrder(user, List.of(item), totalAmount);

        assertNotNull(order);
        assertEquals(OrderStatus.NEW, order.getStatus());
    }

    @Test
    @org.junit.jupiter.api.Order(3)
    void createOrder_WithNullUser_ShouldThrowException() {
        Product product = createTestProduct();
        OrderItem item = createTestOrderItem(product);
        BigDecimal totalAmount = new BigDecimal("200.00");

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            OrderFactory.createOrder(null, List.of(item), totalAmount, OrderStatus.NEW);
        });

        assertTrue(exception.getMessage().contains("Order must have a user"));
    }

    @Test
    @org.junit.jupiter.api.Order(4)
    void createOrder_WithEmptyItems_ShouldThrowException() {
        User user = createTestUser();
        BigDecimal totalAmount = new BigDecimal("200.00");

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            OrderFactory.createOrder(user, List.of(), totalAmount, OrderStatus.NEW);
        });

        assertTrue(exception.getMessage().contains("Order must contain at least one item"));
    }

    @Test
    @org.junit.jupiter.api.Order(5)
    void createOrder_WithNullTotalAmount_ShouldThrowException() {
        User user = createTestUser();
        Product product = createTestProduct();
        OrderItem item = createTestOrderItem(product);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            OrderFactory.createOrder(user, List.of(item), null, OrderStatus.NEW);
        });

        assertTrue(exception.getMessage().contains("Total amount must be greater than zero"));
    }

    @Test
    @org.junit.jupiter.api.Order(6)
    void createOrder_WithNegativeTotalAmount_ShouldThrowException() {
        User user = createTestUser();
        Product product = createTestProduct();
        OrderItem item = createTestOrderItem(product);
        BigDecimal totalAmount = new BigDecimal("-10.00");

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            OrderFactory.createOrder(user, List.of(item), totalAmount, OrderStatus.NEW);
        });

        assertTrue(exception.getMessage().contains("Total amount must be greater than zero"));
    }

    @Test
    @org.junit.jupiter.api.Order(7)
    void createOrder_WithNullStatus_ShouldThrowException() {
        User user = createTestUser();
        Product product = createTestProduct();
        OrderItem item = createTestOrderItem(product);
        BigDecimal totalAmount = new BigDecimal("200.00");

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            OrderFactory.createOrder(user, List.of(item), totalAmount, null);
        });

        assertTrue(exception.getMessage().contains("Order status cannot be null"));
    }
}
