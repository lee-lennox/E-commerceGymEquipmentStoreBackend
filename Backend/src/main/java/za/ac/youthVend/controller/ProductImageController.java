package za.ac.youthVend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.ac.youthVend.domain.Product;
import za.ac.youthVend.domain.ProductImage;
import za.ac.youthVend.service.ProductImageService;

import java.util.List;

@RestController
@RequestMapping("/api/product-images")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ProductImageController {

    private final ProductImageService productImageService;

    /**
     * Get all product images
     */
    @GetMapping
    public ResponseEntity<List<ProductImage>> getAllProductImages() {
        List<ProductImage> images = productImageService.findAll();
        return ResponseEntity.ok(images);
    }

    /**
     * Get product image by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductImage> getProductImageById(@PathVariable Integer id) {
        return productImageService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get all images for a specific product
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductImage>> getImagesByProductId(@PathVariable Integer productId) {
        Product product = new Product();
        product.setProductId(productId);

        List<ProductImage> images = productImageService.findByProduct(product);
        return ResponseEntity.ok(images);
    }

    /**
     * Add new product image
     */
    @PostMapping
    public ResponseEntity<ProductImage> createProductImage(@RequestBody ProductImage image) {
        ProductImage created = productImageService.save(image);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Update product image
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductImage> updateProductImage(
            @PathVariable Integer id,
            @RequestBody ProductImage image) {
        image.setImageId(id);
        ProductImage updated = productImageService.update(image);
        return ResponseEntity.ok(updated);
    }

    /**
     * Delete product image
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProductImage(@PathVariable Integer id) {
        if (!productImageService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productImageService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
