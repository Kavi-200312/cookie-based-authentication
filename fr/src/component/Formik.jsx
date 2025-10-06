// FormikForm.js
import { Formik, Form } from "formik";
import CustomInput from "./CustomInput";
import CustomSelect from "./CustomSelect";
import CustomCheckBox from "./CustomCheckBox";
import { userValidationSchema } from "../validationSchemas/userFormSchema";
// import "./FormStyles.css";

const FormikForm = () => {
  const onSubmit = (values,actions) => {
    console.log("Form Submitted:", values);
    console.log("<<<actions>>>>>>>>>>>:", actions);
    // actions.setFieldError("email", "Email already in use");
  };

  return (
    <div className="form-wrapper">
      <h2 className="form-title">User Registration</h2>

      <Formik
        initialValues={{
          userName: "",
          email: "",
          education: "",
          job: "",
          age: "",
          AccecptedTo: false,
          password: "",
          confirmPassword: "",
        }}
        validationSchema={userValidationSchema}
        onSubmit={onSubmit}
      >
        {(formikProps) => (
            
          <Form>
            <CustomInput
              label="Username"
              name="userName"
              type="text"
              placeholder="Enter your name"
            />

            <CustomInput
              label="Email"
              name="email"
              type="text"
              placeholder="Enter your email"
            />

            <CustomInput
              label="Education"
              name="education"
              type="text"
              placeholder="Enter your education"
            />

            <CustomSelect label="Job Role" name="job">
              <option value="">Select a job role</option>
              <option value="designer">Designer</option>
              <option value="developer">Developer</option>
              <option value="tester">Tester</option>
            </CustomSelect>

            <CustomInput
              label="Age"
              name="age"
              type="number"
              placeholder="Enter your age"
            />

            <CustomInput
              label="Password"
              name="password"
              type="password"
              placeholder="Create a strong password"
            />

            <CustomInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
            />

            <CustomCheckBox
              label="I accept the terms and conditions"
              name="AccecptedTo"
              type="checkbox"
            />
            <button 
            type="submit" 
            className="submit-btn"
            disabled={!(formikProps.isValid && formikProps.dirty)}
            >
              Submit
            </button>

          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FormikForm;
