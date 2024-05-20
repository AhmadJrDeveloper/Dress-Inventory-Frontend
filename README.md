# Dress Inventory Management System

## Overview
Dress Inventory Management System is a comprehensive solution for managing the inventory, sales, and rentals of dresses and accessories in an online store. It offers a range of features to streamline operations, including branch management, access control, product management, rent tracking, and inventory monitoring. The system is built using modern web technologies to ensure efficiency and scalability.

## Technologies Used
- **Frontend**:
  - React.js
  - Material-UI (MUI)
  - CSS

- **Backend**:
  - Node.js
  - Express.js
  - Sequelize (ORM for MySQL)

## Features

### Branch Management
- **Description**: Oversees diverse store branches with dedicated administrators and sellers.
- **Functionality**:
  - Creation, modification, and deletion of store branches.
  - Assignment of dedicated administrators and sellers to each branch.
  - Management of branch-specific information and settings.

### Access Control
- **Description**: Implements roles with specific permissions for administrators and sellers to ensure secure control.
- **Functionality**:
  - Role-based access control (RBAC) system to restrict access to certain features and data.
  - Creation and management of roles (e.g., admin, seller).
  - Assignment of permissions to roles.

### Product Management
- **Description**: Allows the addition, updating, and removal of dresses and accessories for both selling and renting.
- **Functionality**:
  - CRUD operations for products (dresses and accessories).
  - Categorization and tagging of products for better organization.
  - Support for managing product availability and pricing.

### Rent Management
- **Description**: Tracks customer rentals, including duration, due dates, and return status.
- **Functionality**:
  - Recording and monitoring of rental transactions.
  - Calculation of rental duration and due dates.
  - Status tracking for rented items (e.g., rented, overdue, returned).

### Inventory Tracking
- **Description**: Monitors inventory to prevent overbooking and ensure product availability.
- **Functionality**:
  - Real-time tracking of product inventory across branches.
  - Alerting system for low stock or out-of-stock items.
  - Integration with other modules to update inventory based on sales and rentals.
