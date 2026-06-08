package za.ac.youthVend.service;

import za.ac.youthVend.domain.Order;
import za.ac.youthVend.domain.User;
import za.ac.youthVend.domain.enums.OrderStatus;

import java.util.List;

public interface IOrderService extends IService<Order, Integer> {

    List<Order> findByUser(User user);

    List<Order> findByUserEmail(String email);

    List<Order> findByStatus(OrderStatus status);
}
