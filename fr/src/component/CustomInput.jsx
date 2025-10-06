// CustomInput.js
import { useState } from "react";
import { useField } from "formik";
import "./FormStyles.css";

const CustomInput = ({ label, type, ...props }) => {
  const [field, meta] = useField(props.name);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="form-control">
      <label htmlFor={props.name} className="form-label">
        {label}
      </label>
      <div className="password-wrapper">
        <input
          {...props}
          {...field}
          type={inputType}
          className={`form-input ${meta.touched && meta.error ? "error-input" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {meta.touched && meta.error && (
        <div className="error-text">{meta.error}</div>
      )}
    </div>
  );
};

export default CustomInput;
