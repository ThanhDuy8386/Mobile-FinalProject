import { plainToInstance, ClassConstructor } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { NextFunction, Request, Response } from "express";

interface FieldError {
  field: string;
  message: string;
}

const flattenValidationErrors = (
  validationErrors: ValidationError[],
  parentField = ""
): FieldError[] => {
  return validationErrors.flatMap((error) => {
    const fieldName = parentField
      ? `${parentField}.${error.property}`
      : error.property;
    const ownErrors = error.constraints
      ? Object.values(error.constraints).map((message) => ({
          field: fieldName,
          message
        }))
      : [];

    const childErrors = error.children?.length
      ? flattenValidationErrors(error.children, fieldName)
      : [];

    return [...ownErrors, ...childErrors];
  });
};

export const validateDto =
  <T extends object>(DtoClass: ClassConstructor<T>) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const dtoObject = plainToInstance(DtoClass, req.body);
    const validationErrors = await validate(dtoObject, {
      whitelist: true,
      forbidNonWhitelisted: true
    });

    if (validationErrors.length > 0) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: flattenValidationErrors(validationErrors)
      });
      return;
    }

    req.body = dtoObject;
    next();
  };
