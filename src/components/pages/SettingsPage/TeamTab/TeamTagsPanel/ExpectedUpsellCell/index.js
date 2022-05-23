import React, { useEffect, useState } from "react";
import { updateTeamTag } from "store/actions/settings-actions";
import { connect } from "react-redux";
import { func, number } from "prop-types";
import Input from "components/common/Input";

const ExpectedUpsellCell = ({ tagId, value, onTeamTagUpdate }) => {
  const [inputValue, setInputValue] = useState(value);
  useEffect(() => setInputValue(value), [value]);
  return (
    <div className="conciergeTableInputCell">
      <Input
        type="number"
        step="0.1"
        min="0"
        max="20"
        value={inputValue}
        onChange={(value) => value >= 0 && value <= 20 && setInputValue(value)}
        onBlur={() => inputValue !== value && onTeamTagUpdate(tagId, {
          expected_upsell: +inputValue,
        })}
      />
    </div>
  );
};

ExpectedUpsellCell.propTypes = {
  onTeamTagUpdate: func.isRequired,
  tagId: number.isRequired,
  value: number.isRequired,
};

const actions = {
  onTeamTagUpdate: updateTeamTag,
};

export default connect(null, actions)(ExpectedUpsellCell);
