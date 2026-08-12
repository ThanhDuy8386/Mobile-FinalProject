# EZ Finance API Basic Documentation

Base URL:

```text
http://localhost:5000/api
```

Swagger UI:

```text
http://localhost:5000/api-docs
```

Protected APIs require this header:

```http
Authorization: Bearer <token>
```

Common error response:

```json
{
  "success": "boolean",
  "message": "string",
  "errors": "array"
}
```

## 1. Login

Role: authenticate user and return JWT token.

URL:

```text
POST /api/auth/login
```

Request body:

```json
{
  "email": "string",
  "password": "string"
}
```

Example:

```json
{
  "email": "demo@ezfinance.com",
  "password": "123456"
}
```

Parameters: none.

Response JSON type:

```json
{
  "success": "boolean",
  "message": "string",
  "data": {
    "user": {
      "id": "number",
      "fullName": "string",
      "email": "string",
      "createdAt": "string(date-time)",
      "updatedAt": "string(date-time)"
    },
    "token": "string"
  }
}
```

## 2. Register

Role: create a new account. The backend also creates default categories for the new user.

URL:

```text
POST /api/auth/register
```

Request body:

```json
{
  "fullName": "string",
  "email": "string",
  "password": "string"
}
```

Example:

```json
{
  "fullName": "Nguyen Van An",
  "email": "an@example.com",
  "password": "123456"
}
```

Parameters: none.

Response JSON type:

```json
{
  "success": "boolean",
  "message": "string",
  "data": {
    "user": {
      "id": "number",
      "fullName": "string",
      "email": "string",
      "createdAt": "string(date-time)",
      "updatedAt": "string(date-time)"
    },
    "token": "string"
  }
}
```

## 3. Dashboard Summary

Role: get total income, total expense, balance, recent transactions, and budget summary for the selected month.

URL:

```text
GET /api/reports/dashboard
```

Headers:

```http
Authorization: Bearer <token>
```

Query parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `month` | number | No | Month from 1 to 12. Default is current month. |
| `year` | number | No | Year from 2000 to 2100. Default is current year. |

Example:

```text
GET /api/reports/dashboard?month=8&year=2026
```

Request body: none.

Response JSON type:

```json
{
  "success": "boolean",
  "message": "string",
  "data": {
    "month": "number",
    "year": "number",
    "totalIncome": "string(decimal)",
    "totalExpense": "string(decimal)",
    "balance": "string(decimal)",
    "allTimeBalance": "string(decimal)",
    "transactionCount": "number",
    "recentTransactions": [
      {
        "id": "number",
        "title": "string",
        "amount": "string(decimal)",
        "type": "INCOME | EXPENSE",
        "transactionDate": "string(date)",
        "note": "string | null",
        "category": {
          "id": "number",
          "name": "string",
          "type": "INCOME | EXPENSE",
          "icon": "string | null",
          "color": "string | null"
        }
      }
    ],
    "budgetSummary": [
      {
        "id": "number",
        "limitAmount": "string(decimal)",
        "spentAmount": "string(decimal)",
        "remainingAmount": "string(decimal)",
        "percentage": "number",
        "isExceeded": "boolean",
        "month": "number",
        "year": "number",
        "createdAt": "string(date-time)",
        "updatedAt": "string(date-time)",
        "category": {
          "id": "number",
          "name": "string",
          "icon": "string | null",
          "color": "string | null"
        }
      }
    ]
  }
}
```

## 4. Monthly Report

Role: get income, expense, and balance for all 12 months in a selected year.

URL:

```text
GET /api/reports/monthly
```

Headers:

```http
Authorization: Bearer <token>
```

Query parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `year` | number | No | Year from 2000 to 2100. Default is current year. |

Example:

```text
GET /api/reports/monthly?year=2026
```

Request body: none.

Response JSON type:

```json
{
  "success": "boolean",
  "message": "string",
  "data": [
    {
      "month": "number",
      "totalIncome": "string(decimal)",
      "totalExpense": "string(decimal)",
      "balance": "string(decimal)"
    }
  ]
}
```

## 5. Category CRUD

Category is used to classify transactions as `INCOME` or `EXPENSE`.

### 5.1 Get Categories

URL:

```text
GET /api/categories
```

Headers:

```http
Authorization: Bearer <token>
```

Query parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `type` | `INCOME | EXPENSE` | No | Filter categories by type. |
| `keyword` | string | No | Search by category name. |

Examples:

```text
GET /api/categories
GET /api/categories?type=EXPENSE
GET /api/categories?keyword=food
```

Request body: none.

Response JSON type:

```json
{
  "success": "boolean",
  "message": "string",
  "data": [
    {
      "id": "number",
      "name": "string",
      "type": "INCOME | EXPENSE",
      "icon": "string | null",
      "color": "string | null",
      "createdAt": "string(date-time)",
      "updatedAt": "string(date-time)"
    }
  ]
}
```

### 5.2 Get Category Detail

URL:

```text
GET /api/categories/:id
```

Headers:

```http
Authorization: Bearer <token>
```

Path parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | number | Yes | Category ID. |

Example:

```text
GET /api/categories/1
```

Request body: none.

Response JSON type:

```json
{
  "success": "boolean",
  "message": "string",
  "data": {
    "id": "number",
    "name": "string",
    "type": "INCOME | EXPENSE",
    "icon": "string | null",
    "color": "string | null",
    "createdAt": "string(date-time)",
    "updatedAt": "string(date-time)"
  }
}
```

### 5.3 Create Category

URL:

```text
POST /api/categories
```

Headers:

```http
Authorization: Bearer <token>
```

Parameters: none.

Request body:

```json
{
  "name": "string",
  "type": "INCOME | EXPENSE",
  "icon": "string | null",
  "color": "string | null"
}
```

Example:

```json
{
  "name": "Coffee",
  "type": "EXPENSE",
  "icon": "cafe",
  "color": "#795548"
}
```

Response JSON type:

```json
{
  "success": "boolean",
  "message": "string",
  "data": {
    "id": "number",
    "name": "string",
    "type": "INCOME | EXPENSE",
    "icon": "string | null",
    "color": "string | null",
    "createdAt": "string(date-time)",
    "updatedAt": "string(date-time)"
  }
}
```

### 5.4 Update Category

URL:

```text
PUT /api/categories/:id
```

Headers:

```http
Authorization: Bearer <token>
```

Path parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | number | Yes | Category ID. |

Example:

```text
PUT /api/categories/1
```

Request body:

```json
{
  "name": "string",
  "type": "INCOME | EXPENSE",
  "icon": "string | null",
  "color": "string | null"
}
```

All fields are optional.

Response JSON type:

```json
{
  "success": "boolean",
  "message": "string",
  "data": {
    "id": "number",
    "name": "string",
    "type": "INCOME | EXPENSE",
    "icon": "string | null",
    "color": "string | null",
    "createdAt": "string(date-time)",
    "updatedAt": "string(date-time)"
  }
}
```

### 5.5 Delete Category

URL:

```text
DELETE /api/categories/:id
```

Headers:

```http
Authorization: Bearer <token>
```

Path parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | number | Yes | Category ID. |

Example:

```text
DELETE /api/categories/1
```

Request body: none.

Response JSON type:

```json
{
  "success": "boolean",
  "message": "string",
  "data": {}
}
```

Business rule: category cannot be deleted if it is used by transactions or budgets.

## 6. Budget CRUD

Budget is used to set an expense limit for a category in a month and year.

### 6.1 Get Budgets

URL:

```text
GET /api/budgets
```

Headers:

```http
Authorization: Bearer <token>
```

Query parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `month` | number | No | Month from 1 to 12. Default is current month. |
| `year` | number | No | Year from 2000 to 2100. Default is current year. |
| `categoryId` | number | No | Filter by category ID. |
| `page` | number | No | Page number. Default is 1. |
| `limit` | number | No | Page size. Default is 10, max is 100. |

Examples:

```text
GET /api/budgets
GET /api/budgets?month=8&year=2026
GET /api/budgets?categoryId=1&page=1&limit=10
```

Request body: none.

Response JSON type:

```json
{
  "success": "boolean",
  "message": "string",
  "data": [
    {
      "id": "number",
      "limitAmount": "string(decimal)",
      "spentAmount": "string(decimal)",
      "remainingAmount": "string(decimal)",
      "percentage": "number",
      "isExceeded": "boolean",
      "month": "number",
      "year": "number",
      "createdAt": "string(date-time)",
      "updatedAt": "string(date-time)",
      "category": {
        "id": "number",
        "name": "string",
        "icon": "string | null",
        "color": "string | null"
      }
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "totalItems": "number",
    "totalPages": "number"
  }
}
```

### 6.2 Get Budget Detail

URL:

```text
GET /api/budgets/:id
```

Headers:

```http
Authorization: Bearer <token>
```

Path parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | number | Yes | Budget ID. |

Example:

```text
GET /api/budgets/1
```

Request body: none.

Response JSON type:

```json
{
  "success": "boolean",
  "message": "string",
  "data": {
    "id": "number",
    "limitAmount": "string(decimal)",
    "spentAmount": "string(decimal)",
    "remainingAmount": "string(decimal)",
    "percentage": "number",
    "isExceeded": "boolean",
    "month": "number",
    "year": "number",
    "createdAt": "string(date-time)",
    "updatedAt": "string(date-time)",
    "category": {
      "id": "number",
      "name": "string",
      "icon": "string | null",
      "color": "string | null"
    },
    "transactions": [
      {
        "id": "number",
        "title": "string",
        "amount": "string(decimal)",
        "transactionDate": "string(date)",
        "note": "string | null"
      }
    ]
  }
}
```

### 6.3 Create Budget

URL:

```text
POST /api/budgets
```

Headers:

```http
Authorization: Bearer <token>
```

Parameters: none.

Request body:

```json
{
  "categoryId": "number",
  "limitAmount": "number",
  "month": "number",
  "year": "number"
}
```

Example:

```json
{
  "categoryId": 1,
  "limitAmount": 3000000,
  "month": 8,
  "year": 2026
}
```

Response JSON type:

```json
{
  "success": "boolean",
  "message": "string",
  "data": {
    "id": "number",
    "limitAmount": "string(decimal)",
    "spentAmount": "string(decimal)",
    "remainingAmount": "string(decimal)",
    "percentage": "number",
    "isExceeded": "boolean",
    "month": "number",
    "year": "number",
    "createdAt": "string(date-time)",
    "updatedAt": "string(date-time)",
    "category": {
      "id": "number",
      "name": "string",
      "icon": "string | null",
      "color": "string | null"
    }
  }
}
```

Business rules:

- `categoryId` must be an `EXPENSE` category.
- `limitAmount` must be greater than 0.
- `month` must be from 1 to 12.
- `year` must be from 2000 to 2100.
- A user cannot create duplicate budgets for the same category, month, and year.

### 6.4 Update Budget

URL:

```text
PUT /api/budgets/:id
```

Headers:

```http
Authorization: Bearer <token>
```

Path parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | number | Yes | Budget ID. |

Example:

```text
PUT /api/budgets/1
```

Request body:

```json
{
  "categoryId": "number",
  "limitAmount": "number",
  "month": "number",
  "year": "number"
}
```

All fields are optional.

Response JSON type:

```json
{
  "success": "boolean",
  "message": "string",
  "data": {
    "id": "number",
    "limitAmount": "string(decimal)",
    "spentAmount": "string(decimal)",
    "remainingAmount": "string(decimal)",
    "percentage": "number",
    "isExceeded": "boolean",
    "month": "number",
    "year": "number",
    "createdAt": "string(date-time)",
    "updatedAt": "string(date-time)",
    "category": {
      "id": "number",
      "name": "string",
      "icon": "string | null",
      "color": "string | null"
    }
  }
}
```

### 6.5 Delete Budget

URL:

```text
DELETE /api/budgets/:id
```

Headers:

```http
Authorization: Bearer <token>
```

Path parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | number | Yes | Budget ID. |

Example:

```text
DELETE /api/budgets/1
```

Request body: none.

Response JSON type:

```json
{
  "success": "boolean",
  "message": "string",
  "data": {}
}
```

## 7. Recommended Test Order

1. `POST /api/auth/login`
2. Copy `data.token`
3. Send `Authorization: Bearer <token>`
4. `GET /api/reports/dashboard?month=8&year=2026`
5. `GET /api/reports/monthly?year=2026`
6. `GET /api/categories`
7. `GET /api/budgets?month=8&year=2026`
8. `GET /api/budgets/:id`
