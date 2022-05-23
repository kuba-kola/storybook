import React, { Component } from "react";
import { object } from "prop-types";
import PanelToggle from "components/common/PanelToggle";
import PersonalDetailsBlock from "./PersonalDetailsBlock";
import VehiclesBlock from "./VehiclesBLock";

import "./styles.scss";

class CustomerDetailsPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      vehicleMake: "",
      vehicleModel: "",
      vehicleYear: "",
      vehicleVin: "",
      vehiclePlate: "",
      vehicleMileage: "",
    };
  }

  componentDidMount() {
    const { customer, vehicle, vehicle_set } = this.props.booking;
    const customer_first_name = customer ? customer.first_name : "";
    const customer_last_name = customer ? customer.last_name : "";
    const full_name = customer_first_name && customer_last_name ? `${customer_first_name} ${customer_last_name}` : customer_last_name;
    const customer_email = customer ? customer.email : "";
    const customer_phone_number = customer ? customer.phone_number : "";
    const vehicle_make = vehicle_set ? vehicle_set.make : "";
    const vehicle_model = vehicle_set ? vehicle_set.model : "";
    const vehicle_model_year = vehicle_set ? vehicle_set.model_year : "";
    const vehicle_vin = vehicle && vehicle.vin ? vehicle.vin : "";
    const vehicle_plate = vehicle && vehicle.plate_number ? vehicle.plate_number : "";
    const vehicle_mileage = vehicle && vehicle.mileage ? vehicle.mileage : "";

    this.setState({
      customerName: full_name,
      customerEmail: customer_email,
      customerPhone: customer_phone_number,
      vehicleMake: vehicle_make,
      vehicleModel: vehicle_model,
      vehicleYear: vehicle_model_year,
      vehicleVin: vehicle_vin,
      vehiclePlate: vehicle_plate,
      vehicleMileage: vehicle_mileage,
    });
  }

  handleCustomerDataChange = (fieldName, value) => this.setState({ [fieldName]: value })

  render() {
    const {
      isEditing,
      customerName,
      customerEmail,
      customerPhone,
      vehicleMake,
      vehicleModel,
      vehicleYear,
      vehicleVin,
      vehiclePlate,
      vehicleMileage,
    } = this.state;
    return (
      <PanelToggle
        header={<p className="conciergeBookingDetailsPanelHeader">Customer details</p>}
        className="conciergeCustomerDetailsPanel"
      >
        <section className="conciergeCustomerDetailsPanelBlocksWrapper">
          <PersonalDetailsBlock
            isEditing={isEditing}
            onCustomerChange={this.handleCustomerDataChange}
            customerName={customerName}
            customerEmail={customerEmail}
            customerPhone={customerPhone}
          />
          <VehiclesBlock
            make={vehicleMake}
            model={vehicleModel}
            year={vehicleYear}
            vin={vehicleVin}
            plate={vehiclePlate}
            mileage={vehicleMileage}
          />
        </section>
      </PanelToggle>
    );
  }
}

CustomerDetailsPanel.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  booking: object,
};

CustomerDetailsPanel.defaultProps = {
  booking: null,
};

export default CustomerDetailsPanel;
