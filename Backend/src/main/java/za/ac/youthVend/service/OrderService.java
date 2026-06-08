package za.ac.youthVend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import za.ac.youthVend.domain.Order;
import za.ac.youthVend.domain.User;
import za.ac.youthVend.domain.enums.OrderStatus;
import za.ac.youthVend.repository.OrderRepository;
import za.ac.youthVend.repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService implements IOrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Override
    public Order save(Order entity) {
        if (entity == null) throw new IllegalArgumentException("Order cannot be null");
        return orderRepository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public java.util.Optional<Order> findById(Integer id) {
        return orderRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> findAll() {
        return orderRepository.findAll();
    }

    @Override
    public Order update(Order entity) {
        if (entity == null) throw new IllegalArgumentException("Order cannot be null");
        if (!orderRepository.existsById(entity.getOrderId()))
            throw new IllegalArgumentException("Order not found with id: " + entity.getOrderId());
        return orderRepository.save(entity);
    }

    @Override
    public void deleteById(Integer id) {
        if (!orderRepository.existsById(id))
            throw new IllegalArgumentException("Order not found with id: " + id);
        orderRepository.deleteById(id);
    }

    @Override
    public void delete(Order entity) {
        orderRepository.delete(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Integer id) {
        return orderRepository.existsById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public long count() {
        return orderRepository.count();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> findByUser(User user) {
        return orderRepository.findByUser(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> findByUserEmail(String email) {
        return userRepository.findByEmail(email)
                .map(orderRepository::findByUser)
                .orElse(List.of());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> findByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status);
    }
}
