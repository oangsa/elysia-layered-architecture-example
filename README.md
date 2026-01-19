# Elysia API - Layered Architecture Example

A production-ready REST API built with [Elysia](https://elysiajs.com/) and [Bun](https://bun.sh/), demonstrating **Layered Architecture** with separation of concerns, inspired by .NET enterprise patterns.

## 🏗️ Architecture Overview

This project implements **Layered Architecture** with clear separation of concerns, inspired by .NET enterprise patterns, ensuring:
- ✅ **Separation of Concerns** - Clear boundaries between layers
- ✅ **Dependency Inversion** - Core business logic depends on abstractions
- ✅ **Testability** - Easy to unit test each layer independently
- ✅ **Maintainability** - Changes in one layer don't affect others
- ✅ **Scalability** - Easy to extend and add new features

## 📁 Project Structure

```
src/
├── Presentation/           # API Layer (Controllers, Routes, Validation)
│   ├── Controllers/        # Route handlers
│   │   ├── Core/          # ControllerManager for centralized routing
│   │   └── UserController.ts
│   └── Schemas/           # Elysia validation schemas
│
├── Services/              # Business Logic Layer
│   ├── Core/             # Service base and manager
│   └── Master/           # Domain services (UserService, etc.)
│
├── Services.Contracts/    # Service Interfaces
│   ├── Core/             # Core service interfaces
│   └── Master/           # Domain service interfaces
│
├── Repository/            # Data Access Layer
│   ├── Core/             # Repository base and manager
│   ├── Extensions/       # Query builders and utilities
│   └── UserRepository.ts # Repository implementations
│
├── Contracts/            # Repository Interfaces
│   └── Repository/       # Repository contracts
│
├── Infrastructure/        # Infrastructure Layer
│   ├── Database/         # Database connection and configuration
│   └── Mapper/           # AutoMapper setup
│
├── Entities/             # Domain Layer
│   ├── Models/           # Domain entities
│   ├── DataTransferObjects/  # DTOs for data transfer
│   ├── RequestFeatures/  # Pagination, search, filtering
│   └── Exceptions/       # Custom exception classes
│
└── Shared/               # Shared utilities and constants
    └── Constants/        # Error messages, constants
```

## 🚀 Technologies

- **[Elysia](https://elysiajs.com/)** - Fast and ergonomic web framework
- **[Bun](https://bun.sh/)** - Fast all-in-one JavaScript runtime
- **[Prisma](https://www.prisma.io/)** - Next-generation ORM
- **[AutoMapper](https://automapperts.netlify.app/)** - Object-to-object mapping
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript

## 🎯 Features

- ✅ **Layered Architecture** - Well-organized, maintainable code structure inspired by .NET patterns
- ✅ **Centralized Route Management** - ControllerManager pattern for organized route registration
- ✅ **Dependency Injection** - Service and repository pattern with interface-based abstractions
- ✅ **AutoMapper** - Automatic DTO to Entity mapping
- ✅ **Type-Safe Validation** - Elysia schema validation
- ✅ **Repository Pattern** - Abstracted data access layer with separate implementation layer
- ✅ **Pagination & Filtering** - Built-in request features
- ✅ **Exception Handling** - Custom exception hierarchy
- ✅ **Database Agnostic** - Easy to swap databases via Prisma

## 📦 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed (v1.0 or higher)
- Database (PostgreSQL, MySQL, SQLite, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd elysia_api
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Configure database**

   Update `prisma/schema.prisma` with your database connection:
   ```prisma
   datasource db {
     provider = "postgresql"  // or mysql, sqlite, etc.
     url      = env("DATABASE_URL")
   }
   ```

4. **Set environment variables**
   ```bash
   DATABASE_URL="your-database-connection-string"
   ```

5. **Run migrations**
   ```bash
   bunx prisma migrate dev
   ```

6. **Generate Prisma Client**
   ```bash
   bunx prisma generate
   ```

### Development

Start the development server with hot reload:
```bash
bun run dev
```

The API will be available at `http://localhost:3000`

### Production

Build and run for production:
```bash
bun run start
```

## 🏛️ Architecture Details

### Presentation Layer
- **Controllers**: Handle HTTP requests and responses
- **ControllerManager**: Centralized controller registration and route management
- **Schemas**: Define request/response validation using Elysia's TypeBox schemas
- **Routes**: Register endpoints and middleware through controller methods

### Services Layer
- **Business Logic**: Application logic and business rules
- **Service Manager**: Coordinates multiple services
- **Validation**: Business rule validation

### Repository Layer
- **Repository Implementations**: Concrete data access implementations
- **Query Builders**: Dynamic query construction for filtering and pagination
- **Repository Manager**: Coordinates repository instances

### Infrastructure Layer
- **Database**: Prisma ORM configuration and connection management
- **Mapper**: AutoMapper for DTO/Entity conversion
- **Adapters**: External service integrations

### Domain Layer (Entities)
- **Models**: Core business entities
- **DTOs**: Data transfer objects for API communication
- **Contracts**: Interfaces for services and repositories
- **Exceptions**: Custom error types and domain exceptions
- **Request Features**: Pagination, filtering, and search parameters

## 📝 License

MIT License

## 🙏 Acknowledgments

- Inspired by ASP.NET Core layered architecture patterns
- Built with the amazing Elysia framework
- Powered by Bun's incredible performance
- THIS ENTIRE README.MD IS GENERATED BY AI

## 💡 Note

This architecture follows pragmatic .NET enterprise patterns with layered separation of concerns. While inspired by Clean Architecture principles, it prioritizes practical CRUD-focused development patterns common in .NET applications rather than strict domain-driven design with rich domain models.
