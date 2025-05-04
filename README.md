# AngularCrudApp

This project is a CRUD application built with Angular and json-server. It includes user management, role management, and authentication features.

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v18.2.1)
- Git

## Project Structure

```
angular-crud-app/
├── src/                    # Angular frontend source code
│   ├── app/
│   │   ├── features/      # Feature modules
│   │   │   ├── auth/      # Authentication
│   │   │   ├── user-management/    # User management
│   │   │   └── role-management/    # Role management
│   │   ├── shared/        # Shared components and services
│   │   └── core/          # Core module
│   └── assets/            # Static assets
└── server/                # json-server mock API
    ├── db.json            # Database file
    └── server.js          # Custom routes configuration and auth implementation
```

## Important Restrictions

### User Restrictions

- Users cannot edit or delete their own accounts
- The default Super Admin user (ID: 1) cannot be edited or deleted
- Only Super Admin users can manage other users' accounts

### Role Restrictions

- The Super Admin role (ID: 1) cannot be edited or deleted
- Only Super Admin users can manage roles
- Role permissions cannot be modified for the Super Admin role
- Any role with all permissions assigned will have Super Admin-like privileges
- Exercise caution when assigning all permissions to a role as it grants full system access

## Default Super Admin Credentials

- Email: john.doe@example.com
- Password: 12345

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ramkumar897003/angular-crud-app.git
cd angular-crud-app
```

### 2. Install Dependencies

#### Frontend (Angular)

```bash
# Install Angular dependencies
npm install
```

### 3. Start the Development Servers

#### Backend (json-server)

```bash
# Start json-server with custom server configuration
node server/server.js
```

The json-server will run on `http://localhost:4201`

#### Frontend Application

```bash
# In a new terminal, from the root directory
ng serve
```

The Angular application will run on `http://localhost:4200`

## Available Scripts

### Frontend

- `ng serve` - Start the development server
- `ng build` - Build the application
- `ng test` - Run unit tests

### Backend (json-server)

- `node server/server.js` - Start json-server with custom configuration
- `json-server --watch server/db.json` - Start json-server with default configuration

## Testing

### Frontend Tests

```bash
# Run unit tests
ng test

```
