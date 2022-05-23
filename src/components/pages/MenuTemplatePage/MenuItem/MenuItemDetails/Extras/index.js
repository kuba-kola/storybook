import React, { useState } from "react";
import { connect } from "react-redux";
import {
  bool, arrayOf, string, func, number,
} from "prop-types";
import { equals } from "ramda";

import { setExtrasClipboard, updateExtras } from "store/actions/menu-template-actions";
import Input from "components/common/Input";
import Button from "components/common/Button";
import { servicesExtrasClipboardSelector } from "store/selectors/menu-template-selectors";

import "./styles.scss";

const Extras = ({
  menuItemId, enabled, currentExtras, saveExtras, extrasClipboardContent, copyExtras,
}) => {
  const [extras, setExtras] = useState(currentExtras);
  const [newExtra, setNewExtra] = useState("");

  const addNewExtra = (event) => {
    event.preventDefault();
    setExtras([...extras, newExtra]);
    setNewExtra("");
  };

  const removeExtra = (extra) => () => setExtras(extras.filter((e) => e !== extra));

  return enabled && (
    <div className="packageItem">
      <div className="packageItemInputContainer">
        <span className="packageItemInputLabel">Extras</span>
        <form className="extraForm" onSubmit={addNewExtra}>
          <Input value={newExtra} onChange={setNewExtra} inputClassName="extraInput" />
          <Button className="extraAddButton" onClick={addNewExtra}>Add</Button>
        </form>
        {extras.map((extra) => (
          <div key={extra} className="extraItemContainer">
            <Button className="extraRemoveButton" onClick={removeExtra(extra)}>x</Button>
            <span className="extraItem">
              {extra}
            </span>
          </div>
        ))}
        <div className="extraButtons">
          {!!extras.length && (
            <Button
              className="extraButton"
              onClick={() => copyExtras(extras)}
            >
              Copy
            </Button>
          )}
          {!!extrasClipboardContent.length && (
            <Button
              className="extraButton"
              onClick={() => setExtras(extrasClipboardContent)}
            >
              Paste
            </Button>
          )}
          {!equals(extras, currentExtras) && (
            <Button
              className="extraButton"
              onClick={() => saveExtras(menuItemId, extras)}
            >
              Save
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

Extras.propTypes = {
  menuItemId: number.isRequired,
  enabled: bool,
  currentExtras: arrayOf(string),
  saveExtras: func.isRequired,
  extrasClipboardContent: arrayOf(string),
  copyExtras: func.isRequired,
};

Extras.defaultProps = {
  enabled: false,
  currentExtras: [],
  extrasClipboardContent: [],
};

const mapStateToProps = (state) => ({
  extrasClipboardContent: servicesExtrasClipboardSelector(state),
});

const actions = {
  saveExtras: updateExtras,
  copyExtras: setExtrasClipboard,
};

export default connect(mapStateToProps, actions)(Extras);
