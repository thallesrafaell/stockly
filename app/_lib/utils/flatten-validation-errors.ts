import { type ZodError } from "zod";

export interface FlattenedValidationErrors<TFormSchema> {
  formErrors: string[];
  fieldErrors: {
    [P in keyof TFormSchema]?: string[];
  };
}

export function flattenValidationErrors<TFormSchema>(
  validationErrors: ZodError<TFormSchema> | undefined | null,
): FlattenedValidationErrors<TFormSchema> {
  const result: FlattenedValidationErrors<TFormSchema> = {
    formErrors: [],
    fieldErrors: {} as { [P in keyof TFormSchema]?: string[] },
  };

  if (!validationErrors) {
    return result;
  }

  // For form-level errors (errors not specific to a field)
  if (validationErrors.formErrors.formErrors.length > 0) {
    result.formErrors = validationErrors.formErrors.formErrors;
  }

  // For field-specific errors
  for (const fieldName in validationErrors.formErrors.fieldErrors) {
    if (
      Object.prototype.hasOwnProperty.call(
        validationErrors.formErrors.fieldErrors,
        fieldName,
      )
    ) {
      const errors = validationErrors.formErrors.fieldErrors[
        fieldName as keyof TFormSchema
      ] as string[] | undefined;
      if (errors && errors.length > 0) {
        result.fieldErrors[fieldName as keyof TFormSchema] = errors;
      }
    }
  }

  return result;
}
