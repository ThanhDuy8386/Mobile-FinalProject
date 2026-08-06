import { Router } from "express";
import authRoutes from "./auth.routes";
import budgetRoutes from "./budget.routes";
import categoryRoutes from "./category.routes";
import reportRoutes from "./report.routes";
import transactionRoutes from "./transaction.routes";
import userRoutes from "./user.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "EZ Finance API is running",
    data: {
      status: "UP"
    }
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/transactions", transactionRoutes);
router.use("/budgets", budgetRoutes);
router.use("/reports", reportRoutes);

export default router;
