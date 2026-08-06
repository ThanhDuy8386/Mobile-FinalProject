import { Router } from "express";
import { ReportController } from "../controllers/report.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
const reportController = new ReportController();

router.use(authenticate);

router.get("/dashboard", reportController.dashboard);
router.get("/monthly", reportController.monthly);
router.get("/expenses-by-category", reportController.expensesByCategory);
router.get("/income-by-category", reportController.incomeByCategory);

export default router;
