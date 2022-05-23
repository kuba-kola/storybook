import React, { useState, useEffect } from "react";
import { func, arrayOf, bool } from "prop-types";
import { connect } from "react-redux";
import Select from "react-select";

import { opCodePropType } from "shared/prop-types";
import { opCodesSelector } from "store/selectors/menu-template-selectors";
import { getOpCodes } from "store/actions/menu-template-actions";

const OpCodesSelect = ({
  showAssigned,
  opCode,
  opCodes,
  onChange,
  fetchOpCodes,
}) => {
  const [options, setSelectOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState("");

  useEffect(() => {
    setIsLoading(false);
    if (opCodes) {
      setSelectOptions(opCodes.map(((oc) => ({
        label: `${oc.operation_code} - ${oc.description}`,
        value: oc.id,
        code: oc.operation_code,
      }))));
    }
  }, [opCodes]);

  useEffect(() => {
    let delayedSearch = null;
    if (searchPhrase !== "" || opCode === null) {
      const opCodesSearch = () => {
        setIsLoading(true);
        fetchOpCodes({ search_phrase: searchPhrase, show_assigned: showAssigned });
      };
      const delay = searchPhrase === "" ? 100 : 500;
      delayedSearch = setTimeout(() => {
        opCodesSearch();
      }, delay);
    }

    return () => {
      clearTimeout(delayedSearch);
    };
  }, [searchPhrase, opCode]);

  return (
    <Select
      isClearable
      className="addMenuItemSelectContainer"
      classNamePrefix="addMenuItemSelect"
      placeholder="Select or search"
      loadingMessage={() => "Searching for op codes..."}
      noOptionsMessage={() => "No op codes found."}
      isLoading={isLoading}
      inputValue={searchPhrase}
      onInputChange={setSearchPhrase}
      value={opCode}
      options={options}
      onChange={onChange}
    />
  );
};

OpCodesSelect.propTypes = {
  showAssigned: bool,
  opCode: opCodePropType,
  onChange: func.isRequired,
  opCodes: arrayOf(opCodePropType),
  fetchOpCodes: func.isRequired,
};

OpCodesSelect.defaultProps = {
  showAssigned: false,
  opCode: null,
  opCodes: [],
};

const mapStateToProps = (state) => ({
  opCodes: opCodesSelector(state),
});

const actions = {
  fetchOpCodes: getOpCodes,
};

export default connect(mapStateToProps, actions)(OpCodesSelect);
