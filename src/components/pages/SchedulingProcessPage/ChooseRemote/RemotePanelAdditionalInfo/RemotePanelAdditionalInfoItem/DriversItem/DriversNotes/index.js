import React, { useCallback } from "react";
import {
  object, shape, bool, func,
} from "prop-types";
import Input from "components/common/Input";

const DriversNotes = ({
  additionalInfo: { pickUp, dropOff },
  onChange,
  isPickUp,
  isDropOff,
  disabled,
}) => {
  const onChangeInput = useCallback((value) => {
    if (isPickUp) {
      onChange({
        pickUp: {
          ...pickUp,
          notes: value,
        },
      });
    } else if (isDropOff) {
      onChange({
        dropOff: {
          ...dropOff,
          notes: value,
        },
      });
    }
  }, [onChange]);

  const valueNotes = () => {
    if (isPickUp) return pickUp.notes;
    if (isDropOff) return dropOff.notes;
    return "";
  };

  return (
    <div className="additionalInfoItemColumn fullWidth">
      <Input
        label="Notes"
        onChange={onChangeInput}
        value={valueNotes()}
        disabled={disabled}
        placeholder="Enter your notes for the driver here..."
      />
    </div>
  );
};

DriversNotes.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  onChange: func.isRequired,
  isPickUp: bool,
  isDropOff: bool,
  additionalInfo: shape({
    pickUp: object,
    dropOff: object,
  }),
  disabled: bool,
};

DriversNotes.defaultProps = {
  isPickUp: false,
  isDropOff: false,
  additionalInfo: {},
  disabled: false,
};

export default DriversNotes;
