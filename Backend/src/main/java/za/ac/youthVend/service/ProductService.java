package za.ac.youthVend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import za.ac.youthVend.domain.Category;
import za.ac.youthVend.domain.Product;
import za.ac.youthVend.factory.ProductFactory;
import za.ac.youthVend.repository.ProductRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService implements IProductService {

    private final ProductRepository productRepository;

    @Override
    public Product save(Product entity) {
        if (entity == null) throw new IllegalArgumentException("Product cannot be null");
        return productRepository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Product> findById(Integer id) {
        return productRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> findAll() {
        return productRepository.findAll();
    }

    @Override
    public Product update(Product entity) {
        if (entity == null) throw new IllegalArgumentException("Product cannot be null");
        if (!productRepository.existsById(entity.getProductId()))
            throw new IllegalArgumentException("Product not found with id: " + entity.getProductId());
        return productRepository.save(entity);
    }

    @Override
    public void deleteById(Integer id) {
        if (!productRepository.existsById(id))
            throw new IllegalArgumentException("Product not found with id: " + id);
        productRepository.deleteById(id);
    }

    @Override
    public void delete(Product entity) {
        productRepository.delete(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Integer id) {
        return productRepository.existsById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public long count() {
        return productRepository.count();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Product> findBySku(String sku) {
        return productRepository.findBySku(sku);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> findByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> findByCategoryId(Integer categoryId) {
        return productRepository.findByCategory_CategoryId(categoryId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> searchByKeyword(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return List.of();
        }
        return productRepository.searchByKeyword(keyword.trim());
    }

    // Optional: method to create product using factory
    public Product createProduct(String name, String description, BigDecimal price, String sku, Integer stock, Category category) {
        Product product = ProductFactory.createProduct(name, description, price, sku, stock, category);
        return productRepository.save(product);
    }
}
