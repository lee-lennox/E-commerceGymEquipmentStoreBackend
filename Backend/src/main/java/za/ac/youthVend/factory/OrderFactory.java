package za.ac.youthVend.factory;

import za.ac.youthVend.domain.Address;
import za.ac.youthVend.domain.Order;
import za.ac.youthVend.domain.OrderItem;
import za.ac.youthVend.domain.User;
import za.ac.youthVend.domain.enums.OrderStatus;

import java.math.BigDecimal;
import java.util.List;

public class OrderFactory {

    private OrderFactory() {
        // prevent instantiation
    }

    /* =========================
       FACTORY METHODS
       ========================= */

    public static Order createOrder(User user,
                                    List<OrderItem> items,
                                    BigDecimal totalAmount,
                                    OrderStatus status) {

        validateUser(user);
        validateItems(items);
        validateTotalAmount(totalAmount);
        validateStatus(status);

        return Order.builder()
                .user(user)
                .orderItems(items)
                .totalAmount(totalAmount)
                .status(status)
                .build();
    }

    public static Order createOrder(User user,
                                    List<OrderItem> items,
                                    BigDecimal totalAmount,
                                    Address shippingAddress,
                                    OrderStatus status) {

        validateUser(user);
        validateItems(items);
        validateTotalAmount(totalAmount);
        validateStatus(status);

        return Order.builder()
                .user(user)
                .orderItems(items)
                .totalAmount(totalAmount)
                .shippingAddress(shippingAddress)
                .status(status)
                .build();
    }

    public static Order createNewOrder(User user, List<OrderItem> items, BigDecimal totalAmount) {
        return createOrder(user, items, totalAmount, OrderStatus.NEW);
    }

    /* =========================
       VALIDATION METHODS
       ========================= */

    private static void validateUser(User user) {
        if (user == null) {
            throw new IllegalArgumentException("Order must have a user");
        }
    }

    private static void validateItems(List<OrderItem> items) {
        if (items == null || items.isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item");
        }
    }

    private static void validateTotalAmount(BigDecimal totalAmount) {
        if (totalAmount == null || totalAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Total amount must be greater than zero");
        }
    }

    private static void validateStatus(OrderStatus status) {
        if (status == null) {
            throw new IllegalArgumentException("Order status cannot be null");
        }
    }
}
