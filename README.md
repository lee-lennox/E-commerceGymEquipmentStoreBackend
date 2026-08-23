# GymEquip Store - E-commerce Gym Equipment

A modern full-stack e-commerce application for gym equipment, built with React and Spring Boot.

## Features

- **Product Catalog**: Browse gym equipment with category filtering and search
- **Product Details**: View detailed product information with image galleries
- **Shopping Cart**: Add products to cart with quantity management
- **User Authentication**: Register, login, profile management, and OTP verification
- **Checkout**: Complete purchase with shipping and payment information
- **Order Management**: View order history and status
- **Admin Dashboard**: Manage products, categories, users, and orders
- **Reviews**: Product review and rating system
- **Account Deletion**: Self-service account deletion with scheduled cleanup
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

### Frontend
- React 18
- React Router DOM v7
- Axios for API communication
- Tailwind CSS for styling
- Lucide React for icons

### Backend
- Spring Boot 3.3.2
- Spring Security with JWT authentication
- Spring Data JPA
- PostgreSQL database
- Maven build system
- Docker support

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Java 21+
- PostgreSQL
- Maven

### Backend Setup

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Configure your PostgreSQL database in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/gymstore
spring.datasource.username=your_username
spring.datasource.password=your_password
```

3. Build and run the backend:
```bash
mvn spring-boot:run
```

The API will be available at `http://localhost:8080/api`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure the API URL in `.env`:
```
REACT_APP_API_URL=http://localhost:8080/api
```

4. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:5173`

## Default Admin Account

After starting the backend, you can log in with the admin account:
- Email: `admin@gymstore.com`
- Password: `admin123`

## Project Structure

```
E-commerceGymEquipmentStore/
├── Backend/
│   ├── src/main/java/za/ac/youthVend/
│   │   ├── controller/    # REST API controllers
│   │   ├── service/       # Business logic
│   │   ├── repository/    # Data access layer
│   │   ├── domain/        # Entity definitions
│   │   ├── dto/           # Data transfer objects
│   │   ├── factory/       # Object factories
│   │   ├── security/      # Security configuration & JWT
│   │   ├── config/        # Application configuration
│   │   └── scheduler/     # Scheduled tasks
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── uploads/           # File storage for product images
│   ├── Dockerfile
│   └── pom.xml
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── pages/     # Page components
    │   │   ├── components/# Reusable UI components
    │   │   └── App.js     # Main app with routing
    │   ├── services/
    │   │   └── api.js     # API service layer
    │   └── styles/        # CSS styles
    ├── public/
    │   └── index.html
    ├── nginx.conf
    ├── tailwind.config.js
    └── package.json
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `POST /api/users/forgot-password` - Request password reset
- `POST /api/users/reset-password` - Reset password

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/{id}` - Update product (Admin)
- `DELETE /api/products/{id}` - Delete product (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/{id}` - Update category (Admin)
- `DELETE /api/categories/{id}` - Delete category (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/user/{userId}` - Get user orders
- `PUT /api/orders/{id}/status` - Update order status (Admin)

### Cart
- `GET /api/cart/user/{userId}` - Get cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/{id}` - Update cart item
- `DELETE /api/cart/{id}` - Remove from cart

### Reviews
- `GET /api/reviews/product/{productId}` - Get product reviews
- `POST /api/reviews` - Submit a review

## Documentation

Comprehensive project documentation is available in the [`docs/`](docs/) folder:

| Document | Description | Link |
|----------|-------------|------|
| **PRD** | Product Requirements Document | [View PRD](docs/PRD.md) |
| **App Flow** | User journeys & navigation flows | [View App Flow](docs/APP_FLOW.md) |
| **Tech Stack** | Technology overview & architecture | [View Tech Stack](docs/TECH_STACK.md) |
| **Design Guidelines** | UI/UX standards & component specs | [View Design Guidelines](docs/DESIGN_GUIDELINES.md) |
| **Database Schema** | PostgreSQL schema & entity definitions | [View Database Schema](docs/DATABASE_SCHEMA.md) |
| **UML** | Use cases, class diagrams, sequence diagrams | [View UML](docs/UML.md) |
| **ERD** | Entity Relationship Diagram | [View ERD](docs/ERD.md) |
| **Implementation Plan** | 12-week development roadmap | [View Implementation Plan](docs/IMPLEMENTATION_PLAN.md) |

## License

This project is part of an E-commerce Gym Equipment system.
