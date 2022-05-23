import React, { useState, useEffect } from "react";
import {
  func, arrayOf, number, string, shape,
} from "prop-types";
import { connect } from "react-redux";
import CreatableSelect from "react-select/lib/Creatable";

import { servicePropType } from "shared/prop-types";
import { servicesSelector } from "store/selectors/menu-template-selectors";
import { getServices } from "store/actions/menu-template-actions";

const ServicesSelect = ({
  kind,
  service,
  services,
  excludedServices,
  onChange,
  fetchServices,
}) => {
  const [options, setSelectOptions] = useState([]);

  const createEmptyOption = (label) => ({
    label,
    value: "",
  });

  useEffect(() => {
    if (!services.length) {
      fetchServices();
    }
  }, []);

  useEffect(() => {
    const updateSelectOptions = () => (
      setSelectOptions(
        services
          .filter((s) => s.kind === kind)
          .filter((s) => !excludedServices.includes(s.id))
          .map((s) => ({ value: s.id, label: s.name })),
      )
    );

    if (services.length) {
      updateSelectOptions();
    }
  }, [kind, services, fetchServices]);

  const handleCreate = (serviceName) => {
    const newOption = createEmptyOption(serviceName);
    setSelectOptions([...options, newOption]);
    onChange(newOption);
  };

  return (
    <CreatableSelect
      isSearchable
      className="addMenuItemSelectContainer"
      classNamePrefix="addMenuItemSelect"
      placeholder="Select or create"
      value={service}
      onCreateOption={handleCreate}
      onChange={onChange}
      options={options}
    />
  );
};

ServicesSelect.propTypes = {
  kind: string.isRequired,
  service: shape({
    label: string,
    value: string,
  }),
  services: arrayOf(servicePropType),
  excludedServices: arrayOf(number),
  fetchServices: func.isRequired,
  onChange: func.isRequired,
};

ServicesSelect.defaultProps = {
  services: [],
  excludedServices: [],
  service: null,
};

const mapStateToProps = (state) => ({
  services: servicesSelector(state),
});

const actions = {
  fetchServices: getServices,
};

export default connect(mapStateToProps, actions)(ServicesSelect);
