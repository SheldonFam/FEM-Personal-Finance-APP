/**
 * Reusable form validation rules
 */

export const currencyValidationRules = {
  required: "Amount is required",
  validate: {
    positive: (value: string) => {
      const num = parseFloat(value);
      return (!isNaN(num) && num > 0) || "Amount must be greater than 0";
    },
    validNumber: (value: string) =>
      !isNaN(parseFloat(value)) || "Must be a valid number",
  },
};

export const createMaxValidation = (max: number, fieldLabel = "Amount") => ({
  ...currencyValidationRules,
  validate: {
    ...currencyValidationRules.validate,
    notExceed: (value: string) => {
      const num = parseFloat(value);
      return num <= max || `${fieldLabel} cannot exceed $${max.toFixed(2)}`;
    },
  },
});

export const themeValidationRules = {
  required: "Theme is required",
};

export const requiredFieldRules = (fieldName: string) => ({
  required: `${fieldName} is required`,
  minLength: {
    value: 1,
    message: `${fieldName} cannot be empty`,
  },
});


