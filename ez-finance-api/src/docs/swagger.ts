import type { JsonObject } from "swagger-ui-express";

export const swaggerDocument: JsonObject = {
  openapi: "3.0.3",
  info: {
    title: "EZ Finance API",
    version: "1.0.0",
    description:
      "Backend API for the EZ Finance personal finance mobile application."
  },
  servers: [
    {
      url: "/api",
      description: "Current server"
    }
  ],
  tags: [
    { name: "Health" },
    { name: "Authentication" },
    { name: "Users" },
    { name: "Categories" },
    { name: "Transactions" },
    { name: "Budgets" },
    { name: "Reports" }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    parameters: {
      IdPath: {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
          minimum: 1
        }
      },
      PageQuery: {
        name: "page",
        in: "query",
        schema: {
          type: "integer",
          minimum: 1,
          default: 1
        }
      },
      LimitQuery: {
        name: "limit",
        in: "query",
        schema: {
          type: "integer",
          minimum: 1,
          maximum: 100,
          default: 10
        }
      },
      MonthQuery: {
        name: "month",
        in: "query",
        schema: {
          type: "integer",
          minimum: 1,
          maximum: 12
        }
      },
      YearQuery: {
        name: "year",
        in: "query",
        schema: {
          type: "integer",
          minimum: 2000,
          maximum: 2100
        }
      }
    },
    schemas: {
      TransactionType: {
        type: "string",
        enum: ["INCOME", "EXPENSE"]
      },
      Pagination: {
        type: "object",
        properties: {
          page: { type: "integer", example: 1 },
          limit: { type: "integer", example: 10 },
          totalItems: { type: "integer", example: 25 },
          totalPages: { type: "integer", example: 3 }
        }
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Error message" },
          errors: {
            type: "array",
            items: {},
            example: []
          }
        }
      },
      SuccessResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: {
            type: "string",
            example: "Operation completed successfully"
          },
          data: {
            type: "object"
          }
        }
      },
      HealthData: {
        type: "object",
        properties: {
          status: { type: "string", example: "UP" }
        }
      },
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          fullName: { type: "string", example: "Nguyen Van An" },
          email: { type: "string", format: "email", example: "an@example.com" },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-08-06T10:00:00.000Z"
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2026-08-06T10:00:00.000Z"
          }
        }
      },
      AuthPayload: {
        type: "object",
        properties: {
          user: { $ref: "#/components/schemas/User" },
          token: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          }
        }
      },
      RegisterRequest: {
        type: "object",
        required: ["fullName", "email", "password"],
        properties: {
          fullName: {
            type: "string",
            minLength: 2,
            maxLength: 100,
            example: "Nguyen Van An"
          },
          email: { type: "string", format: "email", example: "an@example.com" },
          password: { type: "string", minLength: 6, example: "123456" }
        }
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "an@example.com" },
          password: { type: "string", example: "123456" }
        }
      },
      UpdateProfileRequest: {
        type: "object",
        properties: {
          fullName: {
            type: "string",
            minLength: 2,
            maxLength: 100,
            example: "Nguyen Van An Updated"
          },
          email: {
            type: "string",
            format: "email",
            example: "newemail@example.com"
          }
        }
      },
      ChangePasswordRequest: {
        type: "object",
        required: ["currentPassword", "newPassword"],
        properties: {
          currentPassword: { type: "string", example: "123456" },
          newPassword: { type: "string", minLength: 6, example: "newpassword123" }
        }
      },
      Category: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Food" },
          type: { $ref: "#/components/schemas/TransactionType" },
          icon: {
            type: "string",
            nullable: true,
            example: "restaurant"
          },
          color: {
            type: "string",
            nullable: true,
            example: "#FF9800"
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-08-06T10:00:00.000Z"
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2026-08-06T10:00:00.000Z"
          }
        }
      },
      CreateCategoryRequest: {
        type: "object",
        required: ["name", "type"],
        properties: {
          name: { type: "string", minLength: 1, maxLength: 100, example: "Food" },
          type: { $ref: "#/components/schemas/TransactionType" },
          icon: {
            type: "string",
            maxLength: 100,
            example: "restaurant"
          },
          color: {
            type: "string",
            maxLength: 20,
            example: "#FF9800"
          }
        }
      },
      UpdateCategoryRequest: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 1, maxLength: 100, example: "Food" },
          type: { $ref: "#/components/schemas/TransactionType" },
          icon: {
            type: "string",
            nullable: true,
            maxLength: 100,
            example: "restaurant"
          },
          color: {
            type: "string",
            nullable: true,
            maxLength: 20,
            example: "#FF9800"
          }
        }
      },
      TransactionCategory: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Food" },
          type: { $ref: "#/components/schemas/TransactionType" },
          icon: {
            type: "string",
            nullable: true,
            example: "restaurant"
          },
          color: {
            type: "string",
            nullable: true,
            example: "#FF9800"
          }
        }
      },
      Transaction: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          title: { type: "string", example: "Lunch" },
          amount: { type: "string", example: "50000.00" },
          type: { $ref: "#/components/schemas/TransactionType" },
          transactionDate: {
            type: "string",
            format: "date",
            example: "2026-08-05"
          },
          note: {
            type: "string",
            nullable: true,
            example: "Lunch with classmates"
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-08-06T10:00:00.000Z"
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2026-08-06T10:00:00.000Z"
          },
          category: { $ref: "#/components/schemas/TransactionCategory" }
        }
      },
      CreateTransactionRequest: {
        type: "object",
        required: ["title", "amount", "type", "categoryId", "transactionDate"],
        properties: {
          title: {
            type: "string",
            minLength: 1,
            maxLength: 150,
            example: "Lunch"
          },
          amount: {
            type: "number",
            minimum: 0.01,
            example: 50000
          },
          type: { $ref: "#/components/schemas/TransactionType" },
          categoryId: {
            type: "integer",
            minimum: 1,
            example: 1
          },
          transactionDate: {
            type: "string",
            format: "date",
            example: "2026-08-05"
          },
          note: {
            type: "string",
            nullable: true,
            maxLength: 1000,
            example: "Lunch with classmates"
          }
        }
      },
      UpdateTransactionRequest: {
        type: "object",
        properties: {
          title: {
            type: "string",
            minLength: 1,
            maxLength: 150,
            example: "Lunch"
          },
          amount: {
            type: "number",
            minimum: 0.01,
            example: 50000
          },
          type: { $ref: "#/components/schemas/TransactionType" },
          categoryId: {
            type: "integer",
            minimum: 1,
            example: 1
          },
          transactionDate: {
            type: "string",
            format: "date",
            example: "2026-08-05"
          },
          note: {
            type: "string",
            nullable: true,
            maxLength: 1000,
            example: "Lunch with classmates"
          }
        }
      },
      BudgetCategory: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Food" },
          icon: {
            type: "string",
            nullable: true,
            example: "restaurant"
          },
          color: {
            type: "string",
            nullable: true,
            example: "#FF9800"
          }
        }
      },
      Budget: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          limitAmount: { type: "string", example: "3000000.00" },
          spentAmount: { type: "string", example: "1250000.00" },
          remainingAmount: { type: "string", example: "1750000.00" },
          percentage: { type: "number", example: 41.67 },
          isExceeded: { type: "boolean", example: false },
          month: { type: "integer", example: 8 },
          year: { type: "integer", example: 2026 },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-08-06T10:00:00.000Z"
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2026-08-06T10:00:00.000Z"
          },
          category: { $ref: "#/components/schemas/BudgetCategory" }
        }
      },
      BudgetDetail: {
        allOf: [
          { $ref: "#/components/schemas/Budget" },
          {
            type: "object",
            properties: {
              transactions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer", example: 1 },
                    title: { type: "string", example: "Lunch" },
                    amount: { type: "string", example: "50000.00" },
                    transactionDate: {
                      type: "string",
                      format: "date",
                      example: "2026-08-05"
                    },
                    note: {
                      type: "string",
                      nullable: true,
                      example: "Lunch with classmates"
                    }
                  }
                }
              }
            }
          }
        ]
      },
      CreateBudgetRequest: {
        type: "object",
        required: ["categoryId", "limitAmount", "month", "year"],
        properties: {
          categoryId: {
            type: "integer",
            minimum: 1,
            example: 1
          },
          limitAmount: {
            type: "number",
            minimum: 0.01,
            example: 3000000
          },
          month: {
            type: "integer",
            minimum: 1,
            maximum: 12,
            example: 8
          },
          year: {
            type: "integer",
            minimum: 2000,
            maximum: 2100,
            example: 2026
          }
        }
      },
      UpdateBudgetRequest: {
        type: "object",
        properties: {
          categoryId: {
            type: "integer",
            minimum: 1,
            example: 1
          },
          limitAmount: {
            type: "number",
            minimum: 0.01,
            example: 3000000
          },
          month: {
            type: "integer",
            minimum: 1,
            maximum: 12,
            example: 8
          },
          year: {
            type: "integer",
            minimum: 2000,
            maximum: 2100,
            example: 2026
          }
        }
      },
      DashboardSummary: {
        type: "object",
        properties: {
          month: { type: "integer", example: 8 },
          year: { type: "integer", example: 2026 },
          totalIncome: { type: "string", example: "15000000.00" },
          totalExpense: { type: "string", example: "5000000.00" },
          balance: { type: "string", example: "10000000.00" },
          allTimeBalance: { type: "string", example: "25000000.00" },
          transactionCount: { type: "integer", example: 12 },
          recentTransactions: {
            type: "array",
            items: { $ref: "#/components/schemas/Transaction" }
          },
          budgetSummary: {
            type: "array",
            items: { $ref: "#/components/schemas/Budget" }
          }
        }
      },
      MonthlyReportItem: {
        type: "object",
        properties: {
          month: { type: "integer", example: 8 },
          totalIncome: { type: "string", example: "15000000.00" },
          totalExpense: { type: "string", example: "5000000.00" },
          balance: { type: "string", example: "10000000.00" }
        }
      },
      CategoryReportItem: {
        type: "object",
        properties: {
          categoryId: { type: "integer", example: 1 },
          categoryName: { type: "string", example: "Food" },
          icon: {
            type: "string",
            nullable: true,
            example: "restaurant"
          },
          color: {
            type: "string",
            nullable: true,
            example: "#FF9800"
          },
          totalAmount: { type: "string", example: "1250000.00" },
          percentage: { type: "number", example: 25 }
        }
      }
    },
    responses: {
      BadRequest: {
        description: "Validation or request error",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" }
          }
        }
      },
      Unauthorized: {
        description: "Missing or invalid bearer token",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" }
          }
        }
      },
      NotFound: {
        description: "Resource not found",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" }
          }
        }
      },
      Conflict: {
        description: "Resource conflict",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" }
          }
        }
      }
    }
  },
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Check API health",
        responses: {
          "200": {
            description: "API is running",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/HealthData" }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" }
            }
          }
        },
        responses: {
          "201": {
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/AuthPayload" }
                      }
                    }
                  ]
                }
              }
            }
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "409": { $ref: "#/components/responses/Conflict" }
        }
      }
    },
    "/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Login with email and password",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" }
            }
          }
        },
        responses: {
          "200": {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/AuthPayload" }
                      }
                    }
                  ]
                }
              }
            }
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" }
        }
      }
    },
    "/auth/me": {
      get: {
        tags: ["Authentication"],
        summary: "Get current user",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Current user retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/User" }
                      }
                    }
                  ]
                }
              }
            }
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" }
        }
      }
    },
    "/users/profile": {
      get: {
        tags: ["Users"],
        summary: "Get profile",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Profile retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/User" }
                      }
                    }
                  ]
                }
              }
            }
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" }
        }
      },
      put: {
        tags: ["Users"],
        summary: "Update profile",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateProfileRequest" }
            }
          }
        },
        responses: {
          "200": {
            description: "Profile updated successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/User" }
                      }
                    }
                  ]
                }
              }
            }
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
          "409": { $ref: "#/components/responses/Conflict" }
        }
      }
    },
    "/users/change-password": {
      put: {
        tags: ["Users"],
        summary: "Change password",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ChangePasswordRequest" }
            }
          }
        },
        responses: {
          "200": {
            description: "Password changed successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" }
              }
            }
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" }
        }
      }
    },
    "/categories": {
      get: {
        tags: ["Categories"],
        summary: "List categories",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "type",
            in: "query",
            schema: { $ref: "#/components/schemas/TransactionType" }
          },
          {
            name: "keyword",
            in: "query",
            schema: {
              type: "string",
              example: "food"
            }
          }
        ],
        responses: {
          "200": {
            description: "Categories retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Category" }
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" }
        }
      },
      post: {
        tags: ["Categories"],
        summary: "Create category",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateCategoryRequest" }
            }
          }
        },
        responses: {
          "201": {
            description: "Category created successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/Category" }
                      }
                    }
                  ]
                }
              }
            }
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "409": { $ref: "#/components/responses/Conflict" }
        }
      }
    },
    "/categories/{id}": {
      get: {
        tags: ["Categories"],
        summary: "Get category by ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdPath" }],
        responses: {
          "200": {
            description: "Category retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/Category" }
                      }
                    }
                  ]
                }
              }
            }
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" }
        }
      },
      put: {
        tags: ["Categories"],
        summary: "Update category",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdPath" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateCategoryRequest" }
            }
          }
        },
        responses: {
          "200": {
            description: "Category updated successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/Category" }
                      }
                    }
                  ]
                }
              }
            }
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
          "409": { $ref: "#/components/responses/Conflict" }
        }
      },
      delete: {
        tags: ["Categories"],
        summary: "Delete category",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdPath" }],
        responses: {
          "200": {
            description: "Category deleted successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" }
              }
            }
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" }
        }
      }
    },
    "/transactions": {
      get: {
        tags: ["Transactions"],
        summary: "List transactions",
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: "#/components/parameters/PageQuery" },
          { $ref: "#/components/parameters/LimitQuery" },
          {
            name: "type",
            in: "query",
            schema: { $ref: "#/components/schemas/TransactionType" }
          },
          {
            name: "categoryId",
            in: "query",
            schema: {
              type: "integer",
              minimum: 1
            }
          },
          { $ref: "#/components/parameters/MonthQuery" },
          { $ref: "#/components/parameters/YearQuery" },
          {
            name: "startDate",
            in: "query",
            schema: {
              type: "string",
              format: "date",
              example: "2026-08-01"
            }
          },
          {
            name: "endDate",
            in: "query",
            schema: {
              type: "string",
              format: "date",
              example: "2026-08-31"
            }
          },
          {
            name: "keyword",
            in: "query",
            schema: {
              type: "string",
              example: "lunch"
            }
          },
          {
            name: "sortBy",
            in: "query",
            schema: {
              type: "string",
              enum: ["transactionDate", "amount", "createdAt", "title"],
              default: "transactionDate"
            }
          },
          {
            name: "sortOrder",
            in: "query",
            schema: {
              type: "string",
              enum: ["ASC", "DESC"],
              default: "DESC"
            }
          }
        ],
        responses: {
          "200": {
            description: "Transactions retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Transaction" }
                        },
                        pagination: { $ref: "#/components/schemas/Pagination" }
                      }
                    }
                  ]
                }
              }
            }
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" }
        }
      },
      post: {
        tags: ["Transactions"],
        summary: "Create transaction",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateTransactionRequest" }
            }
          }
        },
        responses: {
          "201": {
            description: "Transaction created successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/Transaction" }
                      }
                    }
                  ]
                }
              }
            }
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" }
        }
      }
    },
    "/transactions/{id}": {
      get: {
        tags: ["Transactions"],
        summary: "Get transaction by ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdPath" }],
        responses: {
          "200": {
            description: "Transaction retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/Transaction" }
                      }
                    }
                  ]
                }
              }
            }
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" }
        }
      },
      put: {
        tags: ["Transactions"],
        summary: "Update transaction",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdPath" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateTransactionRequest" }
            }
          }
        },
        responses: {
          "200": {
            description: "Transaction updated successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/Transaction" }
                      }
                    }
                  ]
                }
              }
            }
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" }
        }
      },
      delete: {
        tags: ["Transactions"],
        summary: "Delete transaction",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdPath" }],
        responses: {
          "200": {
            description: "Transaction deleted successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" }
              }
            }
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" }
        }
      }
    },
    "/budgets": {
      get: {
        tags: ["Budgets"],
        summary: "List budgets",
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: "#/components/parameters/MonthQuery" },
          { $ref: "#/components/parameters/YearQuery" },
          {
            name: "categoryId",
            in: "query",
            schema: {
              type: "integer",
              minimum: 1
            }
          },
          { $ref: "#/components/parameters/PageQuery" },
          { $ref: "#/components/parameters/LimitQuery" }
        ],
        responses: {
          "200": {
            description: "Budgets retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Budget" }
                        },
                        pagination: { $ref: "#/components/schemas/Pagination" }
                      }
                    }
                  ]
                }
              }
            }
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" }
        }
      },
      post: {
        tags: ["Budgets"],
        summary: "Create budget",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateBudgetRequest" }
            }
          }
        },
        responses: {
          "201": {
            description: "Budget created successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/Budget" }
                      }
                    }
                  ]
                }
              }
            }
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
          "409": { $ref: "#/components/responses/Conflict" }
        }
      }
    },
    "/budgets/{id}": {
      get: {
        tags: ["Budgets"],
        summary: "Get budget by ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdPath" }],
        responses: {
          "200": {
            description: "Budget retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/BudgetDetail" }
                      }
                    }
                  ]
                }
              }
            }
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" }
        }
      },
      put: {
        tags: ["Budgets"],
        summary: "Update budget",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdPath" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateBudgetRequest" }
            }
          }
        },
        responses: {
          "200": {
            description: "Budget updated successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/Budget" }
                      }
                    }
                  ]
                }
              }
            }
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
          "409": { $ref: "#/components/responses/Conflict" }
        }
      },
      delete: {
        tags: ["Budgets"],
        summary: "Delete budget",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdPath" }],
        responses: {
          "200": {
            description: "Budget deleted successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" }
              }
            }
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" }
        }
      }
    },
    "/reports/dashboard": {
      get: {
        tags: ["Reports"],
        summary: "Get dashboard summary",
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: "#/components/parameters/MonthQuery" },
          { $ref: "#/components/parameters/YearQuery" }
        ],
        responses: {
          "200": {
            description: "Dashboard summary retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/DashboardSummary" }
                      }
                    }
                  ]
                }
              }
            }
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" }
        }
      }
    },
    "/reports/monthly": {
      get: {
        tags: ["Reports"],
        summary: "Get monthly report for a year",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/YearQuery" }],
        responses: {
          "200": {
            description: "Monthly report retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: {
                            $ref: "#/components/schemas/MonthlyReportItem"
                          }
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" }
        }
      }
    },
    "/reports/expenses-by-category": {
      get: {
        tags: ["Reports"],
        summary: "Get expense totals grouped by category",
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: "#/components/parameters/MonthQuery" },
          { $ref: "#/components/parameters/YearQuery" }
        ],
        responses: {
          "200": {
            description: "Expense report by category retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: {
                            $ref: "#/components/schemas/CategoryReportItem"
                          }
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" }
        }
      }
    },
    "/reports/income-by-category": {
      get: {
        tags: ["Reports"],
        summary: "Get income totals grouped by category",
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: "#/components/parameters/MonthQuery" },
          { $ref: "#/components/parameters/YearQuery" }
        ],
        responses: {
          "200": {
            description: "Income report by category retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: {
                            $ref: "#/components/schemas/CategoryReportItem"
                          }
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" }
        }
      }
    }
  }
};
