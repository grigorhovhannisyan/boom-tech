import { CustomValidator } from "joi";
import { passwordStrength, DiversityType } from "check-password-strength";

export const joiPasswordStrength: CustomValidator = (value, helper) => {
  const st = passwordStrength(value);
  for (const dt of ["lowercase", "number"] as DiversityType[]) {
    if (!st.contains.includes(dt)) {
      return helper.error("any.invalid");
    }
  }

  return value;
};
