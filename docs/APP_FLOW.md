# Application Flow Document

## GymEquip Store - User Journey & Navigation Flow

**Version:** 1.0  
**Date:** August 2026

---

## 1. Overview

This document describes the complete user flow through the GymEquip Store application, covering both customer (buyer) journeys and administrator workflows.

---

## 2. Public User Flows (No Authentication Required)

### 2.1 Landing & Browsing Flow

```
[HomePage /]
    │
    ├──→ [ProductListPage /products] ──→ [ProductDetailPage /product/:id]
    │                                          │
    │                                          ├──→ [SignInPage] (if not logged in)
    │                                          └──→ [CheckoutPage] (if logged in)
    │
    ├──→ [CategoriesPage /categories] ──→ [ProductListPage /products?category=:id]
    │
    ├──→ [AboutPage /about]
    ├──→ [Contact /contact]
    ├──→ [Shipping /shipping]
    ├──→ [Returns /returns]
    └──→ [FAQ /faq]
```

### 2.2 Authentication Flow

```
[SignUpPage /signup]
    │
    ├──→ OTP Verification (auto-redirect after registration)
    │       │
    │       └──→ [SignInPage /signin]
    │
    └──→ [SignInPage /signin] (existing users)

[SignInPage /signin]
    │
    ├──→ [HomePage /] (successful login)
    ├──→ [ProfilePage /profile] (if redirected)
    └──→ [ForgotPasswordPage /forgot-password]
            │
            └──→ Email sent ──→ [ResetPasswordPage /reset-password?token=...]
                                        │
                                        └──→ [SignInPage /signin]
```

---

## 3. Authenticated Buyer Flows

### 3.1 Shopping Flow

```
[ProductDetailPage /product/:id]
    │
    ├──→ [CartSidebar] (add to cart)
    │       │
    │       ├──→ Update quantity
    │       ├──→ Remove item
    │       └──→ [CheckoutPage /checkout]
    │                   │
    │                   ├──→ Select/Add shipping address
    │                   ├──→ Review order summary
    │                   ├──→ Process payment
    │                   └──→ [OrderConfirmationPage /order-confirmation]
    │                               │
    │                               └──→ [OrdersPage /orders]
    │
    └──→ [ProductDetailPage] (continue shopping)
```

### 3.2 Account Management Flow

```
[ProfilePage /profile]
    │
    ├──→ View/Edit profile information
    ├──→ Manage addresses
    │       ├──→ Add new address
    │       ├──→ Edit existing address
    │       └──→ Delete address
    ├──→ Request account deletion
    │       ├──→ Enter reason
    │       ├──→ Confirm deletion
    │       └──→ Account scheduled for deletion
    └──→ Cancel account deletion (within grace period)

[OrdersPage /orders]
    │
    ├──→ View order history
    ├──→ View order details
    ├──→ Track order status
    └──→ Cancel order (if applicable)
```

### 3.3 Review Flow

```
[OrdersPage /orders]
    │
    └──→ Completed order ──→ [ProductDetailPage /product/:id]
                                    │
                                    └──→ Write review (rating + comment)
```

---

## 4. Admin Flows

### 4.1 Admin Dashboard Navigation

```
[AdminDashboardPage /admin]
    │
    ├──→ [AdminProductsPage /admin/products]
    │       │
    │       ├──→ [AdminProductFormPage /admin/product/new]
    │       └──→ [AdminProductFormPage /admin/product/:id] (edit)
    │
    ├──→ [AdminCategoriesPage /admin/categories]
    │       │
    │       ├──→ [AdminCategoryFormPage /admin/category/new]
    │       └──→ [AdminCategoryFormPage /admin/category/:id] (edit)
    │
    ├──→ [AdminUsersPage /admin/users]
    │       │
    │       ├──→ [AdminUserFormPage /admin/user/new]
    │       └──→ [AdminUserFormPage /admin/user/:id] (edit)
    │
    └──→ [OrdersPage /orders] (admin view - all orders)
```

### 4.2 Product Management Flow

```
[AdminProductsPage /admin/products]
    │
    ├──→ Create Product
    │       │
    │       └──→ [AdminProductFormPage /admin/product/new]
    │                   │
    │                   ├──→ Enter product details (name, description, price, SKU, stock)
    │                   ├──→ Select category
    │                   ├──→ Upload product images
    │                   ├──→ Add color variants
    │                   ├──→ Add weight options
    │                   └──→ Save ──→ [AdminProductsPage]
    │
    ├──→ Edit Product
    │       │
    │       └──→ [AdminProductFormPage /admin/product/:id]
    │                   │
    │                   ├──→ Update fields
    │                   └──→ Save ──→ [AdminProductsPage]
    │
    └──→ Delete Product ──→ Confirmation ──→ [AdminProductsPage]
```

### 4.3 Order Management Flow (Admin)

```
[OrdersPage /orders] (admin view)
    │
    ├──→ View all orders
    ├──→ Filter by status
    ├──→ Update order status (NEW → PENDING → PAID → SHIPPED)
    └──→ Cancel order
```

---

## 5. System Flows (Backend)

### 5.1 Order Processing Flow

```
[Frontend: CheckoutPage]
    │
    └──→ POST /api/orders
            │
            ├──→ Validate user authentication (JWT)
            ├──→ Validate stock availability
            ├──→ Create Order record
            ├──→ Create OrderItem records
            ├──→ Decrease product stock
            ├──→ Create PaymentTransaction record
            ├──→ Clear user's cart
            └──→ Return order confirmation
```

### 5.2 Authentication Flow (Backend)

```
[Frontend: SignInPage]
    │
    └──→ POST /api/users/login
            │
            ├──→ Validate credentials
            ├──→ Generate JWT token
            └──→ Return token + user info

[Frontend: Any authenticated request]
    │
    └──→ Request with Bearer token
            │
            ├──→ JwtAuthenticationFilter validates token
            ├──→ Set SecurityContext with user details
            └──→ Proceed to controller endpoint
```

### 5.3 Account Deletion Flow

```
[Frontend: ProfilePage]
    │
    └──→ POST /api/users/request-deletion
            │
            ├──→ Create AccountDeletionRequest (PENDING)
            ├──→ Schedule deletion date (e.g., 30 days later)
            └──→ Email confirmation to user

[Scheduled Task: AccountDeletionScheduler]
    │
    └──→ Daily check for pending deletions past scheduled date
            │
            ├──→ Anonymize/delete user data
            ├──→ Update status to COMPLETED
            └──→ Disable user account
```

### 5.4 OTP Verification Flow

```
[Frontend: SignUpPage]
    │
    └──→ POST /api/users/register
            │
            ├──→ Create user (emailVerified = false)
            ├──→ Generate OTP code
            ├──→ Send OTP via email
            └──→ Return "verify email" message

[Frontend: OTP Input]
    │
    └──→ POST /api/users/verify-otp
            │
            ├──→ Validate OTP (not expired, matches)
            ├──→ Set emailVerified = true
            └──→ Return success
```

---

## 6. State Transitions

### 6.1 Order Status Lifecycle

```
┌─────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│   NEW   │───→│ PENDING  │───→│   PAID   │───→│ SHIPPED  │
└────┬────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘
     │              │               │               │
     └──────────────┴───────────────┴──────────────→│ CANCELLED
```

| Transition | Trigger | Actor |
|------------|---------|-------|
| NEW → PENDING | Order created | System (auto) |
| PENDING → PAID | Payment confirmed | System (payment) |
| PAID → SHIPPED | Order shipped | Admin |
| Any → CANCELLED | Order cancelled | Admin / Buyer |

### 6.2 Payment Status Lifecycle

```
┌──────────┐    ┌───────────┐    ┌──────────┐    ┌───────────┐
│ PENDING  │───→│ COMPLETED │    │  FAILED  │    │ CANCELLED │
└──────────┘    └───────────┘    └──────────┘    └───────────┘
```

### 6.3 Account Deletion Status Lifecycle

```
┌──────────┐    ┌───────────┐    ┌───────────┐
│ PENDING  │───→│ COMPLETED │    │ CANCELLED │
└────┬─────┘    └───────────┘    └───────────┘
     │                                ▲
     └────────────────────────────────┘
               (User cancels within grace period)
```

---

## 7. Cart Flow (Detailed)

```
[User browses products]
    │
    ├──→ Click "Add to Cart"
    │       │
    │       └──→ POST /api/cart
    │                   │
    │                   └──→ CartItem created/updated in database
    │
    ├──→ Open CartSidebar
    │       │
    │       ├──→ GET /api/cart/user/{userId}
    │       ├──→ Update quantity → PUT /api/cart/{id}
    │       └──→ Remove item → DELETE /api/cart/{id}
    │
    └──→ Proceed to Checkout
            │
            └──→ Cart items converted to OrderItems
                    ├──→ Order created
                    └──→ Cart cleared (DELETE /api/cart/user/{userId})
```

---

## 8. Security Flow

### 8.1 JWT Authentication Flow

```
[Client Request]
    │
    ├──→ Header: Authorization: Bearer <jwt_token>
    │
    └──→ [JwtAuthenticationFilter]
            │
            ├──→ Extract token from header
            ├──→ Validate token signature & expiration
            ├──→ Load user details from token
            ├──→ Set Authentication in SecurityContext
            └──→ Continue to Controller
                    │
                    ├──→ @PreAuthorize checks role
                    └──→ Execute business logic
```

### 8.2 Role-Based Access Control

| Endpoint Pattern | Allowed Roles |
|------------------|---------------|
| `/api/users/register`, `/api/users/login` | Public |
| `/api/products` (GET), `/api/categories` (GET) | Public |
| `/api/cart/**` | BUYER, ADMIN |
| `/api/orders/**` | BUYER, ADMIN |
| `/api/buyer/**` | BUYER, ADMIN |
| `/api/admin/**` | ADMIN only |
| `POST/PUT/DELETE /api/products/**` | ADMIN only |
| `POST/PUT/DELETE /api/categories/**` | ADMIN only |
