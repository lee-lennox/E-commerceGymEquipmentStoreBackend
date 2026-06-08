package za.ac.youthVend.service;

import za.ac.youthVend.domain.Product;

import java.util.List;
import java.util.Optional;

public interface IProductService extends IService<Product, Integer> {

    Optional<Product> findBySku(String sku);

    List<Product> findByName(String name);

    List<Product> findByCategoryId(Integer categoryId);

    List<Product> searchByKeyword(String keyword);
}
