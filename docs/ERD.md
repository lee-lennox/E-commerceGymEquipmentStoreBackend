# Entity Relationship Diagram

## GymEquip Store - Database Relationships

**Version:** 1.0  
**Date:** August 2026  
**Database:** PostgreSQL 14+

---

## 1. Complete ERD (Crow's Foot Notation)

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                    ERD - GYM EQUIP STORE                                │
└─────────────────────────────────────────────────────────────────────────────────────────┘

                                    ┌─────────────┐
                                    │   users     │
                                    ├─────────────┤
                                    │ PK user_id  │
                                    │    username │
                                    │    email    │
                                    │    password │
                                    │    role     │
                                    │    phone    │
                                    │    createdAt│
                                    │    enabled  │
                                    │    emailVer │
                                    │    resetTok │
                                    └──────┬──────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    │                      │                      │
                    │ 1                    │ 1                    │ 1
                    │                      │                      │
                    ▼ *                    ▼ *                    ▼ *
            ┌─────────────┐        ┌─────────────┐        ┌─────────────┐
            │   orders    │        │  cart_items │        │  addresses  │
            ├─────────────┤        ├─────────────┤        ├─────────────┤
            │ PK order_id │        │ PK cartItem │        │ PK addressId│
            │ FK user_id  │        │ FK user_id  │        │ FK user_id  │
            │ FK shipAddr │        │ FK productId│        │    line1    │
            │    totalAmt │        │    quantity │        │    line2    │
            │    status   │        │    unitPrice│        │    city     │
            │    createdAt│        └──────┬──────┘        │    state    │
            └──────┬──────┘                 │             │    postalCd │
                   │                         │             │    country  │
                   │ 1                       │ *           │    type     │
                   │                         │             └─────────────┘
                   ▼ *                       │
            ┌─────────────┐                  │
            │ order_items │                  │
            ├─────────────┤                  │
            │ PK ordItemId│                  │
            │ FK order_id │                  │
            │ FK productId│                  │
            │    quantity │                  │
            │    unitPrice│                  │
            └──────┬──────┘                  │
                   │                         │
                   │ *                       │
                   │                         │
                   └─────────────┬───────────┘
                                 │ *
                                 │
                                 ▼
                         ┌─────────────┐
                         │   products  │
                         ├─────────────┤
                         │ PK productId│
                         │ FK category │
                         │    name     │
                         │    descript │
                         │    price    │
                         │    sku      │
                         │    stock    │
                         │    imagePath│
                         │    imageFile│
                         │    createdAt│
                         │    updatedAt│
                         └──────┬──────┘
                                │
                     ┌──────────┼──────────┐
                     │ 1        │          │ 1
                     │          │          │
                     ▼ *        ▼          ▼ *
              ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
              │product_image│ │ product_    │ │   reviews   │
              │    s        │ │ colors      │ ├─────────────┤
              ├─────────────┤ ├─────────────┤ │ PK reviewId │
              │ PK imageId  │ │ FK productId│ │ FK productId│
              │ FK productId│ │    color    │ │ FK user_id  │
              │    url      │ └─────────────┘ │    rating   │
              │    altText  │                 │    comment  │
              │    priority │                 │    createdAt│
              │    isPrimary│                 │    verified │
              └─────────────┘                 └─────────────┘
                     │
                     │ 1
                     │
                     ▼ *
              ┌─────────────┐
              │  categories │
              ├─────────────┤
              │ PK category │
              │    name     │
              │    slug     │
              └─────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                   OTHER ENTITIES                                        │
└─────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐                              ┌─────────────────────────────┐
│  otp_codes  │                              │ account_deletion_requests   │
├─────────────┤                              ├─────────────────────────────┤
│ PK id       │                              │ PK id                       │
│    email    │                              │ FK user_id (unique)         │
│    otp      │                              │    reason                   │
│    expiryTm │                              │    requestedAt              │
│    verified │                              │    scheduledDeletionDate    │
│    createdAt│                              │    status                   │
└─────────────┘                              │    deletedAt                │
                                             └─────────────────────────────┘

┌─────────────┐                              ┌─────────────────────────────┐
│payment_tran │                              │    product_weight_options   │
sactions      │                              ├─────────────────────────────┤
├─────────────┤                              │ FK product_id               │
│ PK paymentId│                              │    weight_kg                │
│ FK order_id │                              └─────────────────────────────┘
│    amount   │
│    provider │
│    status   │
│    createdAt│
└─────────────┘
```

---

## 2. Entity Details with Cardinality

### 2.1 users ↔ orders
- **Relationship:** One-to-Many
- **Cardinality:** One user can have many orders; each order belongs to one user
- **Foreign Key:** `orders.user_id` → `users.user_id`
- **Cascade:** Delete user → cascade delete orders

### 2.2 users ↔ cart_items
- **Relationship:** One-to-Many
- **Cardinality:** One user can have many cart items; each cart item belongs to one user
- **Foreign Key:** `cart_items.user_id` → `users.user_id`
- **Cascade:** Delete user → cascade delete cart items

### 2.3 users ↔ addresses
- **Relationship:** One-to-Many
- **Cardinality:** One user can have many addresses; each address belongs to one user
- **Foreign Key:** `addresses.user_id` → `users.user_id`
- **Cascade:** Delete user → cascade delete addresses

### 2.4 users ↔ reviews
- **Relationship:** One-to-Many
- **Cardinality:** One user can write many reviews; each review is by one user
- **Foreign Key:** `reviews.user_id` → `users.user_id`
- **Cascade:** Delete user → cascade delete reviews

### 2.5 users ↔ account_deletion_requests
- **Relationship:** One-to-One
- **Cardinality:** One user can have one deletion request; each request is for one user
- **Foreign Key:** `account_deletion_requests.user_id` → `users.user_id`
- **Constraint:** Unique on `user_id`

### 2.6 categories ↔ products
- **Relationship:** One-to-Many
- **Cardinality:** One category can have many products; each product belongs to one category
- **Foreign Key:** `products.category_id` → `categories.category_id`
- **On Delete:** SET NULL (product remains if category deleted)

### 2.7 products ↔ product_images
- **Relationship:** One-to-Many
- **Cardinality:** One product can have many images; each image belongs to one product
- **Foreign Key:** `product_images.product_id` → `products.product_id`
- **Cascade:** Delete product → cascade delete images

### 2.8 products ↔ reviews
- **Relationship:** One-to-Many
- **Cardinality:** One product can have many reviews; each review is for one product
- **Foreign Key:** `reviews.product_id` → `products.product_id`
- **Cascade:** Delete product → cascade delete reviews

### 2.9 products ↔ cart_items
- **Relationship:** One-to-Many
- **Cardinality:** One product can be in many carts; each cart item references one product
- **Foreign Key:** `cart_items.product_id` → `products.product_id`

### 2.10 products ↔ order_items
- **Relationship:** One-to-Many
- **Cardinality:** One product can be in many order items; each order item references one product
- **Foreign Key:** `order_items.product_id` → `products.product_id`

### 2.11 orders ↔ order_items
- **Relationship:** One-to-Many
- **Cardinality:** One order can have many order items; each order item belongs to one order
- **Foreign Key:** `order_items.order_id` → `orders.order_id`
- **Cascade:** Delete order → cascade delete order items

### 2.12 orders ↔ payment_transactions
- **Relationship:** One-to-One
- **Cardinality:** One order has one payment transaction; each payment is for one order
- **Foreign Key:** `payment_transactions.order_id` → `orders.order_id`
- **Constraint:** Unique on `order_id`

### 2.13 orders ↔ addresses
- **Relationship:** Many-to-One
- **Cardinality:** Many orders can use the same shipping address; each order has one shipping address
- **Foreign Key:** `orders.shipping_address_id` → `addresses.address_id`

### 2.14 products ↔ product_colors (Element Collection)
- **Relationship:** One-to-Many (Embedded)
- **Cardinality:** One product can have many color options
- **Table:** `product_colors` with `product_id` + `color`

### 2.15 products ↔ product_weight_options (Element Collection)
- **Relationship:** One-to-Many (Embedded)
- **Cardinality:** One product can have many weight options
- **Table:** `product_weight_options` with `product_id` + `weight_kg`

---

## 3. Associative Entities

### 3.1 cart_items (User-Product Association)
This entity associates users with products in their shopping cart.

| Attribute | Type | Description |
|-----------|------|-------------|
| cart_item_id | PK | Unique identifier |
| user_id | FK | References users.user_id |
| product_id | FK | References products.product_id |
| quantity | Integer | Number of units |
| unit_price | Decimal | Price when added to cart |

### 3.2 order_items (Order-Product Association)
This entity associates orders with the products they contain.

| Attribute | Type | Description |
|-----------|------|-------------|
| order_item_id | PK | Unique identifier |
| order_id | FK | References orders.order_id |
| product_id | FK | References products.product_id |
| quantity | Integer | Number of units ordered |
| unit_price | Decimal | Price at time of order |

---

## 4. Weak Entities

### 4.1 product_images
- Depends on `products` for existence
- No independent meaning without a product
- Identified by `image_id` + `product_id` composite

### 4.2 order_items
- Depends on `orders` for existence
- Cannot exist without an associated order
- Cascade delete from orders

### 4.3 cart_items
- Depends on both `users` and `products`
- Represents transient shopping state
- Cascade delete from users

---

## 5. Relationship Matrix

| Entity | users | categories | products | orders | cart_items | addresses | reviews | otp_codes | del_requests |
|--------|:-----:|:----------:|:--------:|:------:|:----------:|:---------:|:-------:|:---------:|:------------:|
| users | - | - | - | 1:N | 1:N | 1:N | 1:N | - | 1:1 |
| categories | - | - | 1:N | - | - | - | - | - | - |
| products | - | N:1 | - | - | 1:N | - | 1:N | - | - |
| orders | N:1 | - | - | - | - | N:1 | - | - | - |
| cart_items | N:1 | - | N:1 | - | - | - | - | - | - |
| addresses | N:1 | - | - | 1:N | - | - | - | - | - |
| reviews | N:1 | - | N:1 | - | - | - | - | - | - |
| otp_codes | - | - | - | - | - | - | - | - | - |
| del_requests | 1:1 | - | - | - | - | - | - | - | - |

---

## 6. Integrity Constraints

### 6.1 Referential Integrity
- All foreign keys must reference existing primary keys
- ON DELETE CASCADE for: users→orders, users→cart_items, users→addresses, users→reviews, orders→order_items, products→product_images, products→reviews
- ON DELETE SET NULL for: categories→products

### 6.2 Domain Constraints
- `rating` in reviews: 1 ≤ value ≤ 5
- `stock` in products: value ≥ 0
- `quantity` in cart_items/order_items: value > 0
- `role` in users: must be ADMIN, BUYER, or SELLER
- `status` in orders: must be NEW, PENDING, PAID, SHIPPED, or CANCELLED
- `status` in payment_transactions: must be PENDING, COMPLETED, FAILED, or CANCELLED

### 6.3 Unique Constraints
- `users.email` must be unique
- `products.sku` must be unique
- `categories.name` must be unique
- `categories.slug` must be unique
- `otp_codes.email` must be unique
- `account_deletion_requests.user_id` must be unique
- `payment_transactions.order_id` must be unique
