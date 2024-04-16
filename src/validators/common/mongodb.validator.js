import { body, param } from "express-validator";

export const mongoIdPathVariableValidator = (idName) => {
  return [
    param(idName)
      .notEmpty()
      .isMongoId()
      .withMessage(`Invalid ${idName} in path params`),
  ];
};

export const mongoIdRequestBodyValidator = (idName) => {
  return [body(idName).notEmpty().isMongoId().withMessage(`Invalid ${idName}`)];
};
