import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { TransactionType } from "../enums/TransactionType";
import { Category } from "./Category";
import { User } from "./User";

@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 150 })
  title!: string;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  amount!: string;

  @Column({ type: "enum", enum: TransactionType })
  type!: TransactionType;

  @Column({ type: "date" })
  transactionDate!: string;

  @Column({ type: "text", nullable: true })
  note!: string | null;

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

  @ManyToOne(() => User, (user) => user.transactions, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @ManyToOne(() => Category, (category) => category.transactions, {
    onDelete: "RESTRICT"
  })
  @JoinColumn({ name: "categoryId" })
  category!: Category;
}
