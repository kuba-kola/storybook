import React from "react";
import { string, number, oneOfType } from "prop-types";
import { identity } from "ramda";
import Block from "components/common/Block";
import Input from "components/common/Input";

import "./styles.scss";

const VehiclesBlock = ({
  make,
  model,
  year,
  vin,
  plate,
  mileage,
}) => (
  <Block title="Vehicles" className="conciergeBookingDetailsPanelHalfPart">
    <section className="conciergeVehiclesBlockInputsContainer">
      <Input label="Make" disabled onChange={identity} value={make} />
      <Input label="VIN" disabled onChange={identity} value={vin} />
      <Input label="Year" disabled onChange={identity} value={year} />
      <Input label="Plate" disabled onChange={identity} value={plate} />
      <Input label="Model" disabled onChange={identity} value={model} />
      <Input label="Mileage" disabled onChange={identity} value={mileage} />
    </section>
  </Block>
);

VehiclesBlock.propTypes = {
  make: string,
  model: string,
  year: oneOfType([string, number]),
  vin: string,
  plate: string,
  mileage: oneOfType([string, number]),
};

VehiclesBlock.defaultProps = {
  make: "",
  model: "",
  year: "",
  vin: "",
  plate: "",
  mileage: "",
};

export default VehiclesBlock;
