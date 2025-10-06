import * as yup from "yup";

export const userValidationSchema = yup.object().shape({
    userName: yup
        .string()
        .typeError("Username must be a text string.")
        .min(3, "Username must be at least 3 characters long.")
        .max(40, "Username must not exceed 40 characters.")
        .required("Username is required."),

    email: yup
        .string()
        .email("Please provide a valid email address.")
        .max(50, "Email address must not exceed 50 characters.")
        .required("Email address is required."),

    education: yup
        .string()
        .typeError("Education must be a text string.")
        .max(200, "Education details must not exceed 200 characters.")
        .required("Education information is required."),

    password: yup
        .string()
        .typeError("Password must be a string.")
        .min(8, "Password must be at least 8 characters long.")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter.")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter.")
        .matches(/\d/, "Password must contain at least one number.")
        .matches(/[@$!%*?&#^()\-_=+{}[\]|\\:;"'<>,./]/, "Password must contain at least one special character.")
        .required("Password is required."),

    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], "Passwords must match.")
        .required("Please confirm your password."),

    job: yup
        .string()
        .oneOf(["developer", "tester", "designer"], "Job must be one of: Developer, Tester, or Designer.")
        .required("Job role is required."),

    age: yup
        .number()
        .typeError("Age must be a number.")
        .positive("Age must be a positive number.")
        .integer("Age must be a whole number.")
        .min(18, "You must be at least 18 years old.")
        .max(100, "Age must be less than or equal to 100.")
        .required("Age is required."),

    AccecptedTo: yup
        .boolean()
        .oneOf([true], "You must accept the terms to proceed.")
        .required("Terms acceptance is required.")
});
