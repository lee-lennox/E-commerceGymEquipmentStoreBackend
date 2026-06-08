package za.ac.youthVend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.ac.youthVend.domain.Review;
import za.ac.youthVend.service.ReviewService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reviews")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // Get reviews for a product
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getProductReviews(@PathVariable Integer productId) {
        List<Review> reviews = reviewService.getProductReviews(productId);
        return ResponseEntity.ok(reviews);
    }

    // Get average rating for a product
    @GetMapping("/product/{productId}/rating")
    public ResponseEntity<Map<String, Object>> getProductRating(@PathVariable Integer productId) {
        Double averageRating = reviewService.getAverageRating(productId);
        Long reviewCount = reviewService.getReviewCount(productId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("averageRating", averageRating);
        response.put("reviewCount", reviewCount);
        
        return ResponseEntity.ok(response);
    }

    // Check if user can review (has purchased)
    @GetMapping("/product/{productId}/can-review")
    public ResponseEntity<Map<String, Boolean>> canReview(@RequestParam Integer userId, 
                                                           @PathVariable Integer productId) {
        boolean canReview = reviewService.hasUserPurchasedProduct(userId, productId);
        boolean hasReviewed = reviewService.existsByProductIdAndUserId(productId, userId);
        
        Map<String, Boolean> response = new HashMap<>();
        response.put("canReview", canReview && !hasReviewed);
        response.put("hasReviewed", hasReviewed);
        
        return ResponseEntity.ok(response);
    }

    // Create a review
    @PostMapping
    public ResponseEntity<Review> createReview(@RequestParam Integer userId,
                                                @RequestParam Integer productId,
                                                @RequestParam Integer rating,
                                                @RequestBody(required = false) Map<String, String> body) {
        String comment = body != null ? body.get("comment") : null;
        Review review = reviewService.createReview(userId, productId, rating, comment);
        return ResponseEntity.status(HttpStatus.CREATED).body(review);
    }

    // Update a review
    @PutMapping("/{reviewId}")
    public ResponseEntity<Review> updateReview(@PathVariable Integer reviewId,
                                                @RequestParam Integer userId,
                                                @RequestBody Map<String, Object> body) {
        Integer rating = (Integer) body.get("rating");
        String comment = (String) body.get("comment");
        Review review = reviewService.updateReview(reviewId, userId, rating, comment);
        return ResponseEntity.ok(review);
    }

    // Delete a review
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable Integer reviewId,
                                              @RequestParam Integer userId) {
        reviewService.deleteReview(reviewId, userId);
        return ResponseEntity.noContent().build();
    }
}