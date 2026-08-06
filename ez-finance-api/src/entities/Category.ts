import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from "typeorm";
import { TransactionType } from "../enums/TransactionType";
import { Budget } from "./Budget";
import { Transaction } from "./Transaction";
import { User } from "./User";

@Entity("categories")
@Unique("UQ_categories_user_name_type", ["userId", "name", "type"])
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "enum", enum: TransactionType })
  type!: TransactionType;

  @Column({ type: "varchar", length: 100, nullable: true })
  icon!: string | null;

  @Column({ type: "varchar", length: 20, nullable: true })
  color!: string | null;

  @Column()
  userId!: number;

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

  @ManyToOne(() => User, (user) => user.categories, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions!: Transaction[];

  @OneToMany(() => Budget, (budget) => budget.category)
  budgets!: Budget[];
}
