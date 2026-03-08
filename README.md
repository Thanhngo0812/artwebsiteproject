# Art Website Project 🎨

## Overview
This is a full-stack e-commerce web application for selling art (paintings, frames, and related materials). It features a standard shopping experience for users (browsing, searching, shopping cart, checkout with VNPay/Momo integration, promotions) and a comprehensive admin dashboard for managing users, products, categories, and orders.

## Tech Stack
### Frontend
- **Framework**: React 19 (bootstrapped with Create React App)
- **Routing**: React Router DOM v7
- **Styling**: SCSS / CSS
- **State Management & API**: Context API & Axios
- **Maps**: TomTom Web SDK Maps
- **Other Utilities**: React Toastify, React Paginate, FontAwesome

### Backend
- **Framework**: Spring Boot 3.5 (Java 17)
- **Database Access**: Spring Data JPA / Hibernate
- **Security**: Spring Security + JWT (JSON Web Tokens) authentication
- **Image Storage**: Cloudinary integration
- **Email services**: Spring Boot Starter Mail (for OTP/notifications)
- **Other Utilities**: Lombok, Spring Validation

### Database
- **MySQL 8.x**
- **Architecture**: Relational schema handling users with roles, products with attributes/variants, orders, and promotion engines. Uses database triggers for dynamic price calculations (e.g., updating minimum product prices based on variants).

## Key Features
- **User Authentication**: Secure Login, Register, OTP Verification, and Password Reset utilizing JWT and email verification.
- **Product Management**: Support for complex product structures including variants (dimensions, prices), materials, multiple images per variant, and categorization.
- **Shopping Cart & Checkout**: Users can add products to cart, apply dynamic promotions or coupons (percentage or fixed amount), and handle shipping info.
- **Admin Dashboard**: Secure panel for administrators to manage products, users, track orders, and configure promotions.
- **Payments Processing**: Transaction histories and integrations set up for payment gateways like VNPAY and MOMO.

## Project Structure
- `backend/artbackendproject/`: Spring Boot Java project implementing an MVC architecture (Controllers, Services, DAOs, Entities, DTOs, Security, config).
- `frontend/artfrontendproject/`: React frontend providing the user interface divided into `pages`, `components`, `hooks`, `context`, and `services`.
- `db/`: Contains the MySQL database initialization schema (`artdbproject.sql`) and sample data dump (`data.sql`).

## Prerequisites
- **Node.js**: v18 or higher
- **Java**: JDK 17
- **Database**: MySQL Server
- **Build Tool**: Maven
- **External Services**: Cloudinary Account (for image uploads), Email account for OTP/mailer.

## Setup & Installation

### 1. Database Setup
1. Open your MySQL client (CLI or Workbench).
2. Execute `db/artdbproject.sql` to initialize the schema, tables, and necessary triggers.
3. Execute `db/data.sql` to populate the database with initial configurations, categories, and demo data.

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend/artbackendproject
   ```
2. Update your local configurations (Database credentials, Cloudinary keys, SMTP setup) in `src/main/resources/application.properties` (or equivalent `.env`).
3. Build and run the project using Maven wrapper:
   ```bash
   ./mvnw spring-boot:run
   ```
   *The backend will typically start on `http://localhost:8888` (as defined in the frontend proxy).*

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend/artfrontendproject
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   *The application will be accessible at `http://localhost:3000` and automatically proxy API requests to `http://localhost:8888`.*
