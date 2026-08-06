import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { CreateCategoryDto } from "../dtos/category/CreateCategoryDto";
import { UpdateCategoryDto } from "../dtos/category/UpdateCategoryDto";
import { authenticate } from "../middleware/auth.middleware";
import { validateDto } from "../middleware/validation.middleware";

const router = Router();
const categoryController = new CategoryController();

router.use(authenticate);

router.get("/", categoryController.listCategories);
router.get("/:id", categoryController.getCategory);
router.post("/", validateDto(CreateCategoryDto), categoryController.createCategory);
router.put("/:id", validateDto(UpdateCategoryDto), categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

export default router;
