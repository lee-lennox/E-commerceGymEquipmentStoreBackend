package za.ac.youthVend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import za.ac.youthVend.domain.Review;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    
    List<Review> findByProductProductIdOrderByCreatedAtDesc(Integer productId);
    
    List<Review> findByUserUserId(Integer userId);
    
    Optional<Review> findByProductProductIdAndUserUserId(Integer productId, Integer userId);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.productId = :productId")
    Double getAverageRatingByProductId(@Param("productId") Integer productId);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.product.productId = :productId")
    Long getCountByProductId(@Param("productId") Integer productId);
    
    boolean existsByProductProductIdAndUserUserId(Integer productId, Integer userId);
}
