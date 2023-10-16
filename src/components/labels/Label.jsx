import React from "react";

const Label = ({ value, required }) => {
  return (
    <div className="label-text">
      <label>
        {value}
        {required && <span className="required-mark">*</span>}
      </label>
    </div>
  );
};

export default Label;
