package za.ac.youthVend.service;

import org.springframework.stereotype.Service;
import za.ac.youthVend.domain.Product;
import za.ac.youthVend.domain.Review;
import za.ac.youthVend.domain.User;
import za.ac.youthVend.repository.OrderItemRepository;
import za.ac.youthVend.repository.ProductRepository;
import za.ac.youthVend.repository.ReviewRepository;
import za.ac.youthVend.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderItemRepository orderItemRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         ProductRepository productRepository,
                         UserRepository userRepository,
                         OrderItemRepository orderItemRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.orderItemRepository = orderItemRepository;
    }

    /**
     * Check if user purchased the product
     */
    public boolean hasUserPurchasedProduct(Integer userId, Integer productId) {
        // Check if user has an order item for this product with completed status
        return orderItemRepository.existsByUserIdAndProductId(userId, productId);
    }

    /**
     * Create a review (only for verified purchasers)
     */
    public Review createReview(Integer userId, Integer productId, Integer rating, String comment) {
        // Verify user purchased the product
        if (!hasUserPurchasedProduct(userId, productId)) {
            throw new IllegalArgumentException("Only verified purchasers can leave a review");
        }

        // Check if user already reviewed this product
        if (reviewRepository.existsByProductProductIdAndUserUserId(productId, userId)) {
            throw new IllegalArgumentException("You have already reviewed this product");
        }

        // Validate rating
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Review review = Review.builder()
                .product(product)
                .user(user)
                .rating(rating)
                .comment(comment)
                .verifiedPurchase(true)
                .createdAt(LocalDateTime.now())
                .build();

        return reviewRepository.save(review);
    }

    /**
     * Get reviews for a product
     */
    public List<Review> getProductReviews(Integer productId) {
        return reviewRepository.findByProductProductIdOrderByCreatedAtDesc(productId);
    }

    /**
     * Get average rating for a product
     */
    public Double getAverageRating(Integer productId) {
        Double avg = reviewRepository.getAverageRatingByProductId(productId);
        return avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0;
    }

    /**
     * Get review count for a product
     */
    public Long getReviewCount(Integer productId) {
        return reviewRepository.getCountByProductId(productId);
    }

    /**
     * Check if user has already reviewed a product
     */
    public boolean existsByProductIdAndUserId(Integer productId, Integer userId) {
        return reviewRepository.existsByProductProductIdAndUserUserId(productId, userId);
    }

    /**
     * Update a review
     */
    public Review updateReview(Integer reviewId, Integer userId, Integer rating, String comment) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));

        if (!review.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("You can only update your own reviews");
        }

        if (rating != null) {
            if (rating < 1 || rating > 5) {
                throw new IllegalArgumentException("Rating must be between 1 and 5");
            }
            review.setRating(rating);
        }

        if (comment != null) {
            review.setComment(comment);
        }

        return reviewRepository.save(review);
    }

    /**
     * Delete a review
     */
    public void deleteReview(Integer reviewId, Integer userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));

        if (!review.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("You can only delete your own reviews");
        }

        reviewRepository.delete(review);
    }
}