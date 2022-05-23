import React from "react";

import DriverAssignedIcon from "assets/images/bookings/booking/driverAssigned.svg";
import EnRouteToCustomerIcon from "assets/images/bookings/booking/enRouteToCustomer.svg";
import ArrivedToLocationIcon from "assets/images/bookings/booking/arrivedToLocation.svg";
import EnRouteToDealershipIcon from "assets/images/bookings/booking/enRouteToDealership.svg";
import ArrivedToDealershipIcon from "assets/images/bookings/booking/arrivedToDealership.svg";

export const driverActivityIcon = (key) => {
  switch (key) {
    case "driver_assigned":
      return <DriverAssignedIcon />;
    case "en_route_to_customer":
      return <EnRouteToCustomerIcon />;
    case "arrived_to_customer":
      return <ArrivedToLocationIcon />;
    case "en_route_to_dealership":
      return <EnRouteToDealershipIcon />;
    case "arrived_to_dealership":
      return <ArrivedToDealershipIcon />;
    default:
      return null;
  }
};

export const driverActivityLabel = (key) => {
  switch (key) {
    case "created":
      return "Pick-up / Drop-off requested";
    case "driver_assigned":
      return "Driver assigned";
    case "en_route_to_customer":
      return "En route to customer";
    case "arrived_to_customer":
      return "Arrived to pickup location";
    case "en_route_to_dealership":
      return "En route to dealership";
    case "arrived_to_dealership":
      return "Arrived to dealership";
    default:
      return null;
  }
};
