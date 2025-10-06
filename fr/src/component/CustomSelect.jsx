import { useField } from "formik";
import "./FormStyles.css";

const CustomSelect = ({ label, children, ...props }) => {
  const [field, meta] = useField(props.name);

  return (
    <div className="form-control">
      <label htmlFor={props.name} className="form-label">
        {label}
      </label>
      <select {...field} {...props} className={`form-input ${meta.touched && meta.error ? "error-input" : ""}`}>
        {children}
      </select>
      {meta.touched && meta.error && <div className="error-text">{meta.error}</div>}
    </div>
  );
};

export default CustomSelect;
