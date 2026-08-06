# EZ Finance API

EZ Finance API is a simple Node.js, TypeScript, Express, MySQL, and TypeORM backend for a personal finance mobile application. It supports authentication, personal categories, income and expense transactions, monthly budgets, dashboard totals, and reports.

## Technology Stack

- Node.js
- TypeScript
- Express.js
- MySQL
- TypeORM with migrations
- JWT authentication
- bcrypt
- class-validator and class-transformer
- dotenv
- cors
- helmet
- morgan
- ts-node-dev

## Prerequisites

- Node.js 18 or newer
- npm
- MySQL 8 or compatible

## Create The Database

```sql
CREATE DATABASE ez_finance
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

## Installation

```bash
cd ez-finance-api
npm install
```

## Environment Configuration

Copy the example environment file and update the values for your machine:

```bash
cp .env.example .env
```

Example values:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=ez_finance

JWT_SECRET=replace_with_a_secure_secret
JWT_EXPIRES_IN=7d
```

## Migration Commands

Run the included initial migration:

```bash
npm run migration:run
```

Generate a new migration after changing entities:

```bash
npm run migration:generate
```

Revert the latest migration:

```bash
npm run migration:revert
```

## Seed Data

```bash
npm run seed
```

Demo account:

- Email: `demo@ezfinance.com`
- Password: `123456`

The seed creates the demo user and default income and expense categories. It is safe to run multiple times.

## Development

```bash
npm run dev
```

The API runs at:

```text
http://localhost:5000/api
```

Swagger UI is available at:

```text
http://localhost:5000/api-docs
```

The OpenAPI JSON document is available at:

```text
http://localhost:5000/api-docs.json
```

## Production

```bash
npm run build
npm start
```

## Authorization

Protected endpoints require a JWT bearer token:

```http
Authorization: Bearer <token>
```

## Endpoints

Health:

- `GET /api/health`

Authentication:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

User profile:

- `GET /api/users/profile`
- `PUT /api/users/profile`
- `PUT /api/users/change-password`

Categories:

- `GET /api/categories`
- `GET /api/categories?type=INCOME`
- `GET /api/categories?type=EXPENSE`
- `GET /api/categories?keyword=food`
- `GET /api/categories/:id`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

Transactions:

- `GET /api/transactions`
- `GET /api/transactions?page=1&limit=10`
- `GET /api/transactions?type=EXPENSE`
- `GET /api/transactions?categoryId=1`
- `GET /api/transactions?month=8&year=2026`
- `GET /api/transactions?startDate=2026-08-01&endDate=2026-08-31`
- `GET /api/transactions?keyword=lunch`
- `GET /api/transactions?sortBy=transactionDate&sortOrder=DESC`
- `GET /api/transactions/:id`
- `POST /api/transactions`
- `PUT /api/transactions/:id`
- `DELETE /api/transactions/:id`

Budgets:

- `GET /api/budgets`
- `GET /api/budgets?month=8&year=2026`
- `GET /api/budgets?categoryId=1&page=1&limit=10`
- `GET /api/budgets/:id`
- `POST /api/budgets`
- `PUT /api/budgets/:id`
- `DELETE /api/budgets/:id`

Reports:

- `GET /api/reports/dashboard`
- `GET /api/reports/dashboard?month=8&year=2026`
- `GET /api/reports/monthly`
- `GET /api/reports/monthly?year=2026`
- `GET /api/reports/expenses-by-category`
- `GET /api/reports/expenses-by-category?month=8&year=2026`
- `GET /api/reports/income-by-category`
- `GET /api/reports/income-by-category?month=8&year=2026`

## Example Requests

Register:

```json
{
  "fullName": "Nguyen Van An",
  "email": "an@example.com",
  "password": "123456"
}
```

Login:

```json
{
  "email": "an@example.com",
  "password": "123456"
}
```

Create category:

```json
{
  "name": "Food",
  "type": "EXPENSE",
  "icon": "restaurant",
  "color": "#FF9800"
}
```

Create transaction:

```json
{
  "title": "Lunch",
  "amount": 50000,
  "type": "EXPENSE",
  "categoryId": 1,
  "transactionDate": "2026-08-05",
  "note": "Lunch with classmates"
}
```

Create budget:

```json
{
  "categoryId": 1,
  "limitAmount": 3000000,
  "month": 8,
  "year": 2026
}
```

Update profile:

```json
{
  "fullName": "Nguyen Van An Updated",
  "email": "newemail@example.com"
}
```

Change password:

```json
{
  "currentPassword": "123456",
  "newPassword": "newpassword123"
}
```

## Postman Testing Order

1. `GET /api/health`
2. `POST /api/auth/register`
3. `POST /api/auth/login`
4. Copy the JWT token from the login response
5. `GET /api/auth/me`
6. `GET /api/categories`
7. `POST /api/transactions`
8. `GET /api/transactions`
9. `POST /api/budgets`
10. `GET /api/budgets`
11. `GET /api/reports/dashboard`
12. `GET /api/reports/monthly`
13. `GET /api/reports/expenses-by-category`

In Postman, open the Authorization tab for protected requests, choose `Bearer Token`, and paste the token. You can also set this header manually:

```http
Authorization: Bearer <token>
```

## Response Format

Successful response:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

List response:

```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 25,
    "totalPages": 3
  }
}
```

Error response:

```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

## Project Structure

```text
ez-finance-api/
+-- src/
|   +-- config/
|   |   +-- data-source.ts
|   |   +-- env.ts
|   +-- controllers/
|   |   +-- auth.controller.ts
|   |   +-- user.controller.ts
|   |   +-- category.controller.ts
|   |   +-- transaction.controller.ts
|   |   +-- budget.controller.ts
|   |   +-- report.controller.ts
|   +-- entities/
|   |   +-- User.ts
|   |   +-- Category.ts
|   |   +-- Transaction.ts
|   |   +-- Budget.ts
|   +-- enums/
|   |   +-- TransactionType.ts
|   +-- routes/
|   |   +-- auth.routes.ts
|   |   +-- user.routes.ts
|   |   +-- category.routes.ts
|   |   +-- transaction.routes.ts
|   |   +-- budget.routes.ts
|   |   +-- report.routes.ts
|   |   +-- index.ts
|   +-- services/
|   |   +-- auth.service.ts
|   |   +-- user.service.ts
|   |   +-- category.service.ts
|   |   +-- transaction.service.ts
|   |   +-- budget.service.ts
|   |   +-- report.service.ts
|   +-- dtos/
|   +-- middleware/
|   +-- types/
|   +-- utils/
|   +-- database/
|   |   +-- migrations/
|   |   +-- seed.ts
|   +-- app.ts
|   +-- server.ts
+-- .env.example
+-- .gitignore
+-- package.json
+-- tsconfig.json
+-- README.md
```

## Main Business Rules

- Users can only access their own categories, transactions, and budgets.
- Passwords are stored as bcrypt hashes and are never returned in API responses.
- Registering a user automatically creates default income and expense categories.
- Category names must be unique for the same user and type.
- Categories cannot be deleted while transactions or budgets reference them.
- Transaction amounts must be greater than zero.
- A transaction category must belong to the authenticated user.
- Transaction type must match the selected category type.
- Budget limits must be greater than zero.
- Budget month must be between 1 and 12.
- Budget year must be between 2000 and 2100.
- Only expense categories can have budgets.
- A user cannot create duplicate budgets for the same category, month, and year.
- Budget spent amount is calculated from expense transactions and is not stored.
- Money values are stored as `DECIMAL(15,2)` and returned as strings with two decimal places.
- Report query parameters default to the current month and year when they are not provided.

## Full Setup From An Empty Folder

```bash
mkdir ez-finance-api
cd ez-finance-api
npm init -y
npm install express typeorm mysql2 reflect-metadata dotenv cors helmet morgan bcrypt jsonwebtoken class-validator class-transformer
npm install -D typescript ts-node ts-node-dev typeorm-ts-node-commonjs @types/node @types/express @types/cors @types/morgan @types/bcrypt @types/jsonwebtoken
cp .env.example .env
npm run migration:run
npm run seed
npm run dev
```
