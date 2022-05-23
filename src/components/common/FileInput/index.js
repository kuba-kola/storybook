import React from "react";
import { string, func } from "prop-types";

import "./styles.scss";

const FileInput = ({
  error,
  label,
  onChange,
  ...props
}) => {
  const fileInput = React.createRef();

  const handleClick = () => fileInput.current.click();

  return (
    <div className="conciergeFileInputWrapper">
      <input
        type="file"
        accept=".csv"
        ref={fileInput}
        onChange={(e) => onChange(e.target.files[0])}
        hidden
        {...props}
      />
      <button type="button" className="conciergeFileInputButton" onClick={handleClick}>
        {label}
      </button>
      <p className="conciergeInputError">{error}</p>
    </div>
  );
};

FileInput.propTypes = {
  error: string,
  label: string,
  onChange: func.isRequired,
};

FileInput.defaultProps = {
  error: null,
  label: null,
};

export default FileInput;
