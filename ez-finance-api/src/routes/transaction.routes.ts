import { Router } from "express";
import { TransactionController } from "../controllers/transaction.controller";
import { CreateTransactionDto } from "../dtos/transaction/CreateTransactionDto";
import { UpdateTransactionDto } from "../dtos/transaction/UpdateTransactionDto";
import { authenticate } from "../middleware/auth.middleware";
import { validateDto } from "../middleware/validation.middleware";

const router = Router();
const transactionController = new TransactionController();

router.use(authenticate);

router.get("/", transactionController.listTransactions);
router.get("/:id", transactionController.getTransaction);
router.post(
  "/",
  validateDto(CreateTransactionDto),
  transactionController.createTransaction
);
router.put(
  "/:id",
  validateDto(UpdateTransactionDto),
  transactionController.updateTransaction
);
router.delete("/:id", transactionController.deleteTransaction);

export default router;
