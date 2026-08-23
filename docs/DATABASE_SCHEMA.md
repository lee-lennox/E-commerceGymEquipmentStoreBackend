# Database Schema Document

## GymEquip Store - PostgreSQL Schema

**Version:** 1.0  
**Date:** August 2026  
**Database:** PostgreSQL 14+

---

## 1. Schema Overview

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    users     │────→│   orders     │←────│ order_items  │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       │              ┌─────┴─────┐              │
       │              │  payment_ │              │
       │              │transactions│              │
       │              └───────────┘              │
       │                                         │
┌──────┴───────┐     ┌──────────────┐           │
│   addresses  │     │  cart_items  │           │
└──────────────┘     └──────┬───────┘           │
                            │                   │
┌──────────────┐     ┌──────┴───────┐           │
│  categories  │←────│   products   │←──────────┘
└──────────────┘     └──────┬───────┘
                            │
                     ┌──────┴───────┐
                     │ product_images│
                     └───────────────┘
                            │
                     ┌──────┴───────┐
                     │   reviews    │
                     └──────────────┘
```

---

## 2. Entity Definitions

### 2.1 users

Stores registered user accounts.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| user_id | SERIAL | PRIMARY KEY | Unique identifier |
| username | VARCHAR(255) | NOT NULL | Display name |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Email address |
| password | VARCHAR(255) | NOT NULL | BCrypt hashed password |
| role | VARCHAR(50) | NOT NULL | ADMIN, BUYER, or SELLER |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Registration date |
| enabled | BOOLEAN | NOT NULL, DEFAULT TRUE | Account active status |
| email_verified | BOOLEAN | NOT NULL, DEFAULT FALSE | Email verification status |
| phone | VARCHAR(50) | NULL | Contact phone number |
| reset_token | VARCHAR(255) | NULL | Password reset token |
| reset_token_expiry | TIMESTAMP | NULL | Token expiration time |

**Indexes:**
- `idx_users_email` on `email` (unique)
- `idx_users_role` on `role`

---

### 2.2 categories

Product categories for organization and filtering.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| category_id | SERIAL | PRIMARY KEY | Unique identifier |
| name | VARCHAR(255) | NOT NULL, UNIQUE | Category name |
| slug | VARCHAR(255) | NOT NULL, UNIQUE | URL-friendly identifier |

**Indexes:**
- `idx_categories_slug` on `slug` (unique)

---

### 2.3 products

Individual products in the catalog.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| product_id | SERIAL | PRIMARY KEY | Unique identifier |
| name | VARCHAR(255) | NOT NULL | Product name |
| description | TEXT | NULL | Product description |
| price | DECIMAL(10,2) | NOT NULL | Product price |
| sku | VARCHAR(255) | NOT NULL, UNIQUE | Stock keeping unit |
| stock | INTEGER | NOT NULL | Available quantity |
| category_id | INTEGER | FOREIGN KEY → categories | Product category |
| image_path | VARCHAR(500) | NULL | Primary image path |
| image_file_name | VARCHAR(255) | NULL | Image file name |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation date |
| updated_at | TIMESTAMP | NULL | Last update date |

**Indexes:**
- `idx_products_sku` on `sku` (unique)
- `idx_products_category` on `category_id`
- `idx_products_price` on `price`

---

### 2.4 product_colors (Element Collection)

Color options for products.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| product_id | INTEGER | FOREIGN KEY → products | Parent product |
| color | VARCHAR(50) | NOT NULL | Color name/value |

---

### 2.5 product_weight_options (Element Collection)

Weight options for products.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| product_id | INTEGER | FOREIGN KEY → products | Parent product |
| weight_kg | INTEGER | NOT NULL | Weight in kilograms |

---

### 2.6 product_images

Additional product images.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| image_id | SERIAL | PRIMARY KEY | Unique identifier |
| product_id | INTEGER | NOT NULL, FOREIGN KEY → products | Parent product |
| url | VARCHAR(500) | NOT NULL | Image URL/path |
| alt_text | VARCHAR(255) | NULL | Accessibility text |
| priority | INTEGER | NULL | Display order |
| is_primary | BOOLEAN | NOT NULL, DEFAULT FALSE | Primary image flag |

**Indexes:**
- `idx_product_images_product` on `product_id`

---

### 2.7 addresses

User shipping and billing addresses.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| address_id | SERIAL | PRIMARY KEY | Unique identifier |
| user_id | INTEGER | FOREIGN KEY → users | Owner user |
| line1 | VARCHAR(255) | NOT NULL | Street address line 1 |
| line2 | VARCHAR(255) | NULL | Street address line 2 |
| city | VARCHAR(100) | NOT NULL | City name |
| state | VARCHAR(100) | NULL | State/Province |
| postal_code | VARCHAR(20) | NULL | Postal/ZIP code |
| country | VARCHAR(100) | NOT NULL | Country |
| type | VARCHAR(50) | NOT NULL | BILLING or SHIPPING |

**Indexes:**
- `idx_addresses_user` on `user_id`

---

### 2.8 cart_items

Shopping cart items per user.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| cart_item_id | SERIAL | PRIMARY KEY | Unique identifier |
| user_id | INTEGER | NOT NULL, FOREIGN KEY → users | Cart owner |
| product_id | INTEGER | NOT NULL, FOREIGN KEY → products | Product |
| quantity | INTEGER | NOT NULL | Item quantity |
| unit_price | DECIMAL(10,2) | NOT NULL | Price at time of add |

**Indexes:**
- `idx_cart_items_user` on `user_id`
- `idx_cart_items_product` on `product_id`

---

### 2.9 orders

Customer orders.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| order_id | SERIAL | PRIMARY KEY | Unique identifier |
| user_id | INTEGER | NOT NULL, FOREIGN KEY → users | Ordering user |
| total_amount | DECIMAL(10,2) | NOT NULL | Order total |
| shipping_address_id | INTEGER | FOREIGN KEY → addresses | Shipping address |
| status | VARCHAR(50) | NOT NULL | Order status enum |
| created_at | TIMESTAMP | DEFAULT NOW() | Order date |

**Indexes:**
- `idx_orders_user` on `user_id`
- `idx_orders_status` on `status`
- `idx_orders_created` on `created_at`

---

### 2.10 order_items

Individual items within an order.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| order_item_id | SERIAL | PRIMARY KEY | Unique identifier |
| order_id | INTEGER | NOT NULL, FOREIGN KEY → orders | Parent order |
| product_id | INTEGER | NOT NULL, FOREIGN KEY → products | Product |
| quantity | INTEGER | NOT NULL | Quantity ordered |
| unit_price | DECIMAL(10,2) | NOT NULL | Price at time of order |

**Indexes:**
- `idx_order_items_order` on `order_id`
- `idx_order_items_product` on `product_id`

---

### 2.11 payment_transactions

Payment records linked to orders.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| payment_id | SERIAL | PRIMARY KEY | Unique identifier |
| order_id | INTEGER | NOT NULL, FOREIGN KEY → orders | Linked order |
| amount | DECIMAL(10,2) | NOT NULL | Payment amount |
| provider | VARCHAR(100) | NOT NULL | Payment provider |
| status | VARCHAR(50) | NOT NULL | Payment status |
| created_at | TIMESTAMP | DEFAULT NOW() | Transaction date |

**Indexes:**
- `idx_payments_order` on `order_id` (unique - one payment per order)
- `idx_payments_status` on `status`

---

### 2.12 reviews

Product reviews and ratings.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| review_id | SERIAL | PRIMARY KEY | Unique identifier |
| product_id | INTEGER | NOT NULL, FOREIGN KEY → products | Reviewed product |
| user_id | INTEGER | NOT NULL, FOREIGN KEY → users | Reviewing user |
| rating | INTEGER | NOT NULL | Rating 1-5 stars |
| comment | VARCHAR(1000) | NULL | Review text |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Review date |
| verified_purchase | BOOLEAN | NOT NULL, DEFAULT TRUE | Verified purchase flag |

**Indexes:**
- `idx_reviews_product` on `product_id`
- `idx_reviews_user` on `user_id`

---

### 2.13 otp_codes

Email verification OTP codes.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier |
| email | VARCHAR(255) | NOT NULL, UNIQUE | User email |
| otp | VARCHAR(10) | NOT NULL | OTP code |
| expiry_time | TIMESTAMP | NOT NULL | Code expiration |
| verified | BOOLEAN | NOT NULL, DEFAULT FALSE | Verification status |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation time |

**Indexes:**
- `idx_otp_email` on `email` (unique)

---

### 2.14 account_deletion_requests

User-initiated account deletion requests.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGSERIAL | PRIMARY KEY | Unique identifier |
| user_id | INTEGER | NOT NULL, FOREIGN KEY → users, UNIQUE | Requesting user |
| reason | TEXT | NOT NULL | Deletion reason |
| requested_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Request date |
| scheduled_deletion_date | TIMESTAMP | NOT NULL | Scheduled deletion |
| status | VARCHAR(50) | NOT NULL, DEFAULT 'PENDING' | PENDING/COMPLETED/CANCELLED |
| deleted_at | TIMESTAMP | NULL | Actual deletion time |

**Indexes:**
- `idx_deletion_user` on `user_id` (unique)
- `idx_deletion_status` on `status`
- `idx_deletion_scheduled` on `scheduled_deletion_date`

---

## 3. Enumerations

### 3.1 UserRole

```sql
ENUM: ADMIN, BUYER, SELLER
```

### 3.2 OrderStatus

```sql
ENUM: NEW, PENDING, PAID, SHIPPED, CANCELLED
```

### 3.3 PaymentStatus

```sql
ENUM: PENDING, COMPLETED, FAILED, CANCELLED
```

### 3.4 AddressType

```sql
ENUM: BILLING, SHIPPING
```

### 3.5 DeletionStatus

```sql
ENUM: PENDING, COMPLETED, CANCELLED
```

---

## 4. Relationships Summary

| Parent Table | Child Table | Relationship | Foreign Key |
|-------------|------------|-------------|-------------|
| users | orders | One-to-Many | orders.user_id |
| users | cart_items | One-to-Many | cart_items.user_id |
| users | addresses | One-to-Many | addresses.user_id |
| users | reviews | One-to-Many | reviews.user_id |
| users | account_deletion_requests | One-to-One | account_deletion_requests.user_id |
| categories | products | One-to-Many | products.category_id |
| products | product_images | One-to-Many | product_images.product_id |
| products | reviews | One-to-Many | reviews.product_id |
| products | cart_items | One-to-Many | cart_items.product_id |
| products | order_items | One-to-Many | order_items.product_id |
| orders | order_items | One-to-Many | order_items.order_id |
| orders | payment_transactions | One-to-One | payment_transactions.order_id |
| addresses | orders | One-to-Many | orders.shipping_address_id |

---

## 5. Data Integrity Rules

1. **Cascade Deletes:**
   - Deleting a user cascades to: orders, cart_items, addresses, reviews
   - Deleting a category sets products.category_id to NULL
   - Deleting a product cascades to: product_images, reviews
   - Deleting an order cascades to: order_items, payment_transaction

2. **Stock Management:**
   - Stock is decreased when an order is placed
   - Stock must be checked before order creation
   - Negative stock is not allowed

3. **Order Total Calculation:**
   - Total = SUM(order_items.quantity × order_items.unit_price)
   - Must match payment_transaction.amount

4. **Review Constraints:**
   - Rating must be between 1 and 5
   - One review per user per product

---

## 6. Sample Queries

### 6.1 Get products with category
```sql
SELECT p.*, c.name AS category_name
FROM products p
LEFT JOIN categories c ON p.category_id = c.category_id;
```

### 6.2 Get user orders with items
```sql
SELECT o.*, oi.quantity, oi.unit_price, p.name AS product_name
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
WHERE o.user_id = ?;
```

### 6.3 Get product reviews with average rating
```sql
SELECT p.*, 
       AVG(r.rating) AS avg_rating, 
       COUNT(r.review_id) AS review_count
FROM products p
LEFT JOIN reviews r ON p.product_id = r.product_id
GROUP BY p.product_id;
```

### 6.4 Get cart items for user
```sql
SELECT ci.*, p.name, p.image_path, p.price
FROM cart_items ci
JOIN products p ON ci.product_id = p.product_id
WHERE ci.user_id = ?;
```
