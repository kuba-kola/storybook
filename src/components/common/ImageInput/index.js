import React, { useState } from "react";
import {
  string, bool, func, shape,
} from "prop-types";
import cx from "classnames";
import Button from "../Button";

import "./styles.scss";

const ImageInput = ({
  isRounded,
  onImageChange,
  onDelete,
  isEditing,
  inputName,
  image,
  alt,
  imagePresentText,
  noImageText,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const imageUrl = () => (
    process.env.NODE_ENV === "development"
      ? `${process.env.REACT_APP_ROOT_URL}${image.url}`
      : image.url
  );

  return (
    <>
      <label
        className="conciergeImageInputLabel"
        htmlFor={inputName}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={cx("conciergeImageInputLabelImage", {
            conciergeImageInputRounded: isRounded,
          })}
        >
          {image && image.url ? (
            <img
              src={imageUrl()}
              alt={alt}
              className="conciergeImageInputImage"
            />
          ) : (
            <p className="conciergeImageInputNoImageText">{noImageText}</p>
          )}
          {imagePresentText && isHovered && isEditing ? (
            <div className="conciergeImageInputHoverView">
              <p className="conciergeImageInputUploadText">{imagePresentText}</p>
            </div>
          ) : null}
        </div>
        <input
          type="file"
          disabled={!isEditing}
          className="conciergeImageInputFileInput"
          name={inputName}
          onChange={(e) => onImageChange(e)}
        />
        {isRounded && (
          <div className="conciergeImageInputOutsideTrigger">
            <p className="conciergeImageInputUploadText">Change</p>
          </div>
        )}
      </label>
      {onDelete && isEditing && (
        <Button
          variant="destructive-outline"
          icon="bin"
          fullWidth
          onClick={onDelete}
        >
          <p>Delete</p>
        </Button>
      )}
    </>
  );
};

ImageInput.propTypes = {
  onImageChange: func.isRequired,
  onDelete: func,
  isEditing: bool,
  inputName: string.isRequired,
  image: shape({}),
  alt: string.isRequired,
  imagePresentText: string.isRequired,
  noImageText: string.isRequired,
};

ImageInput.defaultProps = {
  isEditing: false,
  onDelete: null,
  image: {},
};

export default ImageInput;
