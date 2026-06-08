package za.ac.youthVend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import za.ac.youthVend.domain.Product;
import za.ac.youthVend.service.FileStorageService;
import za.ac.youthVend.service.ProductService;

import java.math.BigDecimal;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ProductController {

    private final ProductService productService;
    private final FileStorageService fileStorageService;
    private final za.ac.youthVend.service.CategoryService categoryService;

    /**
     * Get all products
     */
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.findAll();
        return ResponseEntity.ok(products);
    }

    /**
     * Get product by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Integer id) {
        Optional<Product> productOpt = productService.findById(id);
        return productOpt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get products by category ID
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable Integer categoryId) {
        List<Product> products = productService.findByCategoryId(categoryId);
        return ResponseEntity.ok(products);
    }

    /**
     * Search products by keyword in name or description
     */
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword) {
        List<Product> products = productService.searchByKeyword(keyword);
        return ResponseEntity.ok(products);
    }

    /**
     * Create new product with image upload
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createProduct(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") BigDecimal price,
            @RequestParam("sku") String sku,
            @RequestParam("stock") Integer stock,
            @RequestParam(value = "categoryId", required = false) Integer categoryId,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setSku(sku);
        product.setStock(stock);
        
        // Handle category if provided
        if (categoryId != null) {
            Optional<za.ac.youthVend.domain.Category> categoryOpt = categoryService.findById(categoryId);
            if (categoryOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Category not found with id: " + categoryId);
            }
            product.setCategory(categoryOpt.get());
        }
        
        // Handle image upload if provided
        if (image != null && !image.isEmpty()) {
            String fileName = fileStorageService.storeFile(image);
            product.setImageFileName(fileName);
            product.setImagePath("/api/products/images/" + fileName);
        }
        
        Product created = productService.save(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Update existing product with optional new image
     */
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProduct(
            @PathVariable Integer id,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") BigDecimal price,
            @RequestParam("sku") String sku,
            @RequestParam("stock") Integer stock,
            @RequestParam(value = "categoryId", required = false) Integer categoryId,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        
        Optional<Product> existingProductOpt = productService.findById(id);
        if (existingProductOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Product product = existingProductOpt.get();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setSku(sku);
        product.setStock(stock);
        
        // Handle category if provided
        if (categoryId != null) {
            Optional<za.ac.youthVend.domain.Category> categoryOpt = categoryService.findById(categoryId);
            if (categoryOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Category not found with id: " + categoryId);
            }
            product.setCategory(categoryOpt.get());
        }
        
        // Handle new image upload if provided
        if (image != null && !image.isEmpty()) {
            // Delete old image if exists
            if (product.getImageFileName() != null) {
                fileStorageService.deleteFile(product.getImageFileName());
            }
            
            String fileName = fileStorageService.storeFile(image);
            product.setImageFileName(fileName);
            product.setImagePath("/api/products/images/" + fileName);
        }
        
        Product updated = productService.update(product);
        return ResponseEntity.ok(updated);
    }

    /**
     * Delete product and its image
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
        Optional<Product> productOpt = productService.findById(id);
        if (productOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Product product = productOpt.get();
        
        // Delete image file if exists
        if (product.getImageFileName() != null) {
            fileStorageService.deleteFile(product.getImageFileName());
        }
        
        productService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get product image file
     */
    @GetMapping("/images/{fileName:.+}")
    public ResponseEntity<Resource> getProductImage(@PathVariable("fileName") String fileName) {
        try {
            Path filePath = fileStorageService.getFilePath(fileName);
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = "application/octet-stream";
            String fileNameLower = fileName.toLowerCase();
            if (fileNameLower.endsWith(".jpg") || fileNameLower.endsWith(".jpeg")) {
                contentType = "image/jpeg";
            } else if (fileNameLower.endsWith(".png")) {
                contentType = "image/png";
            } else if (fileNameLower.endsWith(".gif")) {
                contentType = "image/gif";
            } else if (fileNameLower.endsWith(".webp")) {
                contentType = "image/webp";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                    .body(resource);
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Decrease product stock
     */
    @PatchMapping("/{id}/decrease-stock")
    public ResponseEntity<Product> decreaseStock(
            @PathVariable Integer id,
            @RequestBody java.util.Map<String, Integer> request) {
        
        Integer quantity = request.get("quantity");
        
        if (quantity == null || quantity <= 0) {
            return ResponseEntity.badRequest().build();
        }
        
        Optional<Product> productOpt = productService.findById(id);
        if (productOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Product product = productOpt.get();
        
        // Check if enough stock available
        if (product.getStock() < quantity) {
            return ResponseEntity.badRequest().build();
        }
        
        // Decrease stock
        product.setStock(product.getStock() - quantity);
        Product updated = productService.update(product);
        
        return ResponseEntity.ok(updated);
    }
}
