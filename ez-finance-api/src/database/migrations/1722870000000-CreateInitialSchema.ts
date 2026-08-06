import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialSchema1722870000000 implements MigrationInterface {
  name = "CreateInitialSchema1722870000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE users (
        id INT NOT NULL AUTO_INCREMENT,
        fullName VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL,
        passwordHash VARCHAR(255) NOT NULL,
        createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX UQ_users_email (email),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE categories (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        type ENUM('INCOME', 'EXPENSE') NOT NULL,
        icon VARCHAR(100) NULL,
        color VARCHAR(20) NULL,
        userId INT NOT NULL,
        createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX UQ_categories_user_name_type (userId, name, type),
        INDEX IDX_categories_userId (userId),
        PRIMARY KEY (id),
        CONSTRAINT FK_categories_user
          FOREIGN KEY (userId)
          REFERENCES users(id)
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE transactions (
        id INT NOT NULL AUTO_INCREMENT,
        title VARCHAR(150) NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        type ENUM('INCOME', 'EXPENSE') NOT NULL,
        transactionDate DATE NOT NULL,
        note TEXT NULL,
        userId INT NOT NULL,
        categoryId INT NOT NULL,
        createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        INDEX IDX_transactions_userId (userId),
        INDEX IDX_transactions_categoryId (categoryId),
        INDEX IDX_transactions_date (transactionDate),
        PRIMARY KEY (id),
        CONSTRAINT FK_transactions_user
          FOREIGN KEY (userId)
          REFERENCES users(id)
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT FK_transactions_category
          FOREIGN KEY (categoryId)
          REFERENCES categories(id)
          ON DELETE RESTRICT
          ON UPDATE CASCADE
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE budgets (
        id INT NOT NULL AUTO_INCREMENT,
        limitAmount DECIMAL(15,2) NOT NULL,
        month INT NOT NULL,
        year INT NOT NULL,
        userId INT NOT NULL,
        categoryId INT NOT NULL,
        createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX UQ_budgets_user_category_month_year (userId, categoryId, month, year),
        INDEX IDX_budgets_userId (userId),
        INDEX IDX_budgets_categoryId (categoryId),
        PRIMARY KEY (id),
        CONSTRAINT FK_budgets_user
          FOREIGN KEY (userId)
          REFERENCES users(id)
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT FK_budgets_category
          FOREIGN KEY (categoryId)
          REFERENCES categories(id)
          ON DELETE RESTRICT
          ON UPDATE CASCADE
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE budgets");
    await queryRunner.query("DROP TABLE transactions");
    await queryRunner.query("DROP TABLE categories");
    await queryRunner.query("DROP TABLE users");
  }
}
