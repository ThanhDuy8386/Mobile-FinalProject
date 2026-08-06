import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from "typeorm";
import { Category } from "./Category";
import { User } from "./User";

@Entity("budgets")
@Unique("UQ_budgets_user_category_month_year", [
  "userId",
  "categoryId",
  "month",
  "year"
])
export class Budget {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  limitAmount!: string;

  @Column({ type: "int" })
  month!: number;

  @Column({ type: "int" })
  year!: number;

  @Column()
  userId!: number;

  @Column()
  categoryId!: number;

  @CreateDateColumn({
    type: "datetime",
    precision: 6,
    default: () => "CURRENT_TIMESTAMP(6)"
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: "datetime",
    precision: 6,
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)"
  })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.budgets, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @ManyToOne(() => Category, (category) => category.budgets, {
    onDelete: "RESTRICT"
  })
  @JoinColumn({ name: "categoryId" })
  category!: Category;
}
