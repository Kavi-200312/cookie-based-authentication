import { useField } from "formik";
import "./FormStyles.css";

const CustomCheckBox = ({ label, ...props }) => {
  const [field, meta] = useField({ ...props, type: "checkbox" });

  return (
    <div className="checkbox-wrapper">
      <label className="checkbox-label">
        <input type="checkbox" {...props} {...field} className="checkbox-input" />
        {label}
      </label>
      {meta.touched && meta.error && (
        <div className="error-text">{meta.error}</div>
      )}
    </div>
  );
};

export default CustomCheckBox;
