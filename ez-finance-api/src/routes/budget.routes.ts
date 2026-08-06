import { Router } from "express";
import { BudgetController } from "../controllers/budget.controller";
import { CreateBudgetDto } from "../dtos/budget/CreateBudgetDto";
import { UpdateBudgetDto } from "../dtos/budget/UpdateBudgetDto";
import { authenticate } from "../middleware/auth.middleware";
import { validateDto } from "../middleware/validation.middleware";

const router = Router();
const budgetController = new BudgetController();

router.use(authenticate);

router.get("/", budgetController.listBudgets);
router.get("/:id", budgetController.getBudget);
router.post("/", validateDto(CreateBudgetDto), budgetController.createBudget);
router.put("/:id", validateDto(UpdateBudgetDto), budgetController.updateBudget);
router.delete("/:id", budgetController.deleteBudget);

export default router;
