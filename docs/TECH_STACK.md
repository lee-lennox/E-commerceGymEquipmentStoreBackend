# Tech Stack Document

## GymEquip Store - Technology Overview

**Version:** 1.0  
**Date:** August 2026

---

## 1. Architecture Overview

GymEquip Store follows a **Client-Server Architecture** with a clear separation between the frontend and backend:

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  React 18 SPA (Single Page Application)               │  │
│  │  - BrowserRouter for client-side routing              │  │
│  │  - Context API for state management (Cart, Toast)     │  │
│  │  - Axios for HTTP requests                            │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS / HTTP
                         │ REST API (JSON)
┌────────────────────────┴────────────────────────────────────┐
│                       SERVER LAYER                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Spring Boot 3.3.2 Application                        │  │
│  │  - REST Controllers (API Layer)                       │  │
│  │  - Service Layer (Business Logic)                     │  │
│  │  - Repository Layer (Data Access)                     │  │
│  │  - Security Layer (JWT + Spring Security)             │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  PostgreSQL Database                                  │  │
│  │  - Relational data storage                            │  │
│  │  - JPA/Hibernate ORM                                  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Frontend Stack

### 2.1 Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI library for building component-based interfaces |
| React DOM | 18.3.1 | DOM rendering for React |
| React Router DOM | 7.11.0 | Client-side routing and navigation |
| React Scripts | 5.0.1 | Build tooling and development server (Create React App) |

### 2.2 Styling & UI

| Technology | Version | Purpose |
|------------|---------|---------|
| Tailwind CSS | 3.4.17 | Utility-first CSS framework |
| PostCSS | 8.4.49 | CSS transformation and processing |
| Autoprefixer | 10.4.20 | Automatic CSS vendor prefixing |
| tw-animate-css | 1.3.8 | Tailwind CSS animations |
| tailwind-merge | 3.2.0 | Merge Tailwind classes without conflicts |
| clsx | 2.1.1 | Conditional className construction |
| class-variance-authority | 0.7.1 | Component variant management |

### 2.3 UI Component Libraries

| Technology | Version | Purpose |
|------------|---------|---------|
| Radix UI (Primitives) | Various | Headless, accessible UI primitives (Dialog, Dropdown, Tabs, etc.) |
| Material UI (MUI) | 7.3.5 | Material Design components and icons |
| @emotion/react | 11.14.0 | CSS-in-JS styling engine (MUI dependency) |
| @emotion/styled | 11.14.1 | Styled components for Emotion |
| Lucide React | 0.487.0 | Modern icon library |
| Sonner | 2.0.3 | Toast notifications |
| Vaul | 1.1.2 | Drawer component |
| next-themes | 0.4.6 | Theme management |

### 2.4 Data & State Management

| Technology | Version | Purpose |
|------------|---------|---------|
| Axios | 1.13.2 | HTTP client for API requests |
| React Context API | Built-in | Global state management (Cart, Toast) |
| React Hook Form | 7.55.0 | Form handling and validation |

### 2.5 Additional Libraries

| Technology | Version | Purpose |
|------------|---------|---------|
| date-fns | 3.6.0 | Date manipulation and formatting |
| Recharts | 2.15.2 | Data visualization charts (Admin dashboard) |
| Embla Carousel | 8.6.0 | Touch-friendly carousel/slider |
| React Slick | 0.31.0 | Image carousel for product galleries |
| input-otp | 1.4.2 | OTP input component |
| motion | 12.23.24 | Animation library |
| cmdk | 1.1.1 | Command palette / search interface |
| react-day-picker | 8.10.1 | Date picker component |
| react-dnd | 16.0.1 | Drag and drop functionality |
| react-resizable-panels | 2.1.7 | Resizable panel layouts |
| react-responsive-masonry | 2.7.1 | Masonry grid layout |
| web-vitals | 2.1.4 | Performance metrics tracking |

### 2.6 Build & Development

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18+ | JavaScript runtime |
| npm | Bundled | Package manager |
| Webpack (via CRA) | Bundled | Module bundler |
| ESLint | Bundled | Code linting |
| Browserslist | Bundled | Browser compatibility targeting |

---

## 3. Backend Stack

### 3.1 Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 21 | Programming language |
| Spring Boot | 3.3.2 | Application framework |
| Spring Web | 3.3.2 | REST API and web layer |
| Spring Data JPA | 3.3.2 | ORM and data access |
| Spring Security | 3.3.2 | Authentication and authorization |
| Spring Mail | 3.3.2 | Email sending (OTP, notifications) |
| Spring Validation | 3.3.2 | Bean validation |

### 3.2 Database

| Technology | Version | Purpose |
|------------|---------|---------|
| PostgreSQL | 14+ | Primary relational database |
| MySQL Connector | 9.2.0 | Alternative database support (commented out) |
| Hibernate | Bundled | JPA implementation |

### 3.3 Security

| Technology | Version | Purpose |
|------------|---------|---------|
| JJWT API | 0.12.3 | JWT token creation and parsing |
| JJWT Implementation | 0.12.3 | JWT implementation runtime |
| JJWT Jackson | 0.12.3 | JWT JSON serialization |
| BCrypt | Bundled | Password hashing (Spring Security) |

### 3.4 Development Tools

| Technology | Version | Purpose |
|------------|---------|---------|
| Maven | 3.8+ | Build and dependency management |
| Lombok | Bundled | Boilerplate code reduction |
| JUnit 5 | Bundled | Unit testing framework |
| Spring Boot Test | Bundled | Integration testing |

### 3.5 Deployment

| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Dockerfile | Multi-stage build for production |
| Nginx | Reverse proxy and static file serving (frontend) |

---

## 4. API Communication

### 4.1 API Design

| Aspect | Implementation |
|--------|----------------|
| Protocol | HTTP/HTTPS |
| Data Format | JSON |
| Authentication | Bearer Token (JWT) |
| Base URL (Local) | `http://localhost:8080/api` |
| Base URL (Prod) | `https://gymstore-5ni9.onrender.com/api` |
| CORS | Configured for multiple frontend origins |

### 4.2 HTTP Methods

| Method | Usage |
|--------|-------|
| GET | Retrieve data (products, categories, orders) |
| POST | Create resources (register, login, orders, cart) |
| PUT | Update resources (edit product, profile) |
| PATCH | Partial updates (order status, stock) |
| DELETE | Remove resources (cart items, products) |

---

## 5. Development Environment

### 5.1 Prerequisites

| Tool | Minimum Version |
|------|-----------------|
| Node.js | 18.0.0 |
| Java JDK | 21 |
| Maven | 3.8.0 |
| PostgreSQL | 14.0 |
| Git | 2.30.0 |

### 5.2 IDE Support

| IDE | Features |
|-----|----------|
| IntelliJ IDEA | Spring Boot support, Maven integration, Lombok plugin |
| Visual Studio Code | React/JS support, ESLint, Tailwind IntelliSense |

---

## 6. External Services

| Service | Purpose |
|---------|---------|
| Render (Production) | Backend hosting |
| Email SMTP Server | OTP verification emails, password reset emails |
| GitHub | Source code repository |

---

## 7. Technology Justification

### Why React?
- Component-based architecture enables reusable UI components
- Large ecosystem with mature libraries
- Virtual DOM for efficient rendering
- Strong community support

### Why Spring Boot?
- Rapid application development with auto-configuration
- Built-in security, data access, and web capabilities
- Excellent for building RESTful APIs
- Strong enterprise support and documentation

### Why PostgreSQL?
- Robust, open-source relational database
- Excellent support for complex queries
- ACID compliance for transaction integrity
- Good performance for e-commerce workloads

### Why JWT?
- Stateless authentication (no server-side session storage)
- Cross-domain / CORS friendly
- Compact and self-contained tokens
- Industry standard for API security

### Why Tailwind CSS?
- Rapid UI development with utility classes
- Consistent design system
- Small production bundle (with PurgeCSS)
- Easy responsive design implementation
