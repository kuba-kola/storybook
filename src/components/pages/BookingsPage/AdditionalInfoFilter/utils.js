import React from "react";

import ServiceAdvisorIcon from "assets/images/bookings/service_advisor.svg";
import NotArrivedIcon from "assets/images/bookings/driverActivity/done.svg";
import JobConfirmedIcon from "assets/images/bookings/driverActivity/done.svg";
import DriverAssignedIcon from "assets/images/bookings/driverActivity/driverAssigned.svg";
import EnRouteToCustomerIcon from "assets/images/bookings/driverActivity/enRouteToCustomer.svg";
import ArrivedToLocationIcon from "assets/images/bookings/driverActivity/arrivedToLocation.svg";
import EnRouteToDealershipIcon from "assets/images/bookings/driverActivity/enRouteToDealership.svg";
import ArrivedToDealershipIcon from "assets/images/bookings/driverActivity/arrivedToDealership.svg";
import ArrivedIcon from "assets/images/bookings/status/arrived.svg";
import CheckedInIcon from "assets/images/bookings/status/checked-in.svg";
import RecallIcon from "assets/images/bookings/recall_icon.svg";
import CoffeeIcon from "assets/images/bookings/coffee.svg";
import CarIcon from "assets/images/bookings/car.svg";
import LabelIcon from "assets/images/bookings/label.svg";
import PickupIcon from "assets/images/bookings/pickup.svg";
import AlternativeTransportIcon from "assets/images/bookings/alternativeTransport/alternative-transport.svg";
import LyftIcon from "assets/images/bookings/alternativeTransport/lyft.png";
import LoanerIcon from "assets/images/bookings/alternativeTransport/loaner.svg";
import UberIcon from "assets/images/bookings/alternativeTransport/uber.png";
import ShuttleIcon from "assets/images/bookings/alternativeTransport/shuttle1.png";

export const toFilterOption = (item, icon) => ({
  key: item.id,
  icon,
  caption: item.name,
});

export const filtersConfig = [
  {
    key: "service_advisor",
    icon: <ServiceAdvisorIcon />,
    options: [],
  },
  {
    key: "jobStatus",
    icon: <PickupIcon />,
    options: [
      {
        key: "created",
        icon: <JobConfirmedIcon />,
        caption: "Pick-up / Drop-off requested",
      },
      {
        key: "driver_assigned",
        icon: <DriverAssignedIcon />,
        caption: "Driver assigned",
      },
      {
        key: "en_route_to_customer",
        icon: <EnRouteToCustomerIcon />,
        caption: "En route to customer ",
      },
      {
        key: "arrived_to_customer",
        icon: <ArrivedToLocationIcon />,
        caption: "Arrived to customer ",
      },
      {
        key: "en_route_to_dealership",
        icon: <EnRouteToDealershipIcon />,
        caption: "En route to dealership ",
      },
      {
        key: "arrived_to_dealership",
        icon: <ArrivedToDealershipIcon />,
        caption: "Arrived to dealership ",
      },
    ],
  },
  {
    key: "bookingStatus",
    icon: <JobConfirmedIcon />,
    options: [
      {
        key: "not_checked_in",
        icon: <NotArrivedIcon />,
        caption: "Not checked-in yet",
      },
      {
        key: "checked_in",
        icon: <CheckedInIcon />,
        caption: "Checked-in online",
      },
      {
        key: "arrived",
        icon: <ArrivedIcon />,
        caption: "Arrived on site",
      },
    ],
  },
  {
    key: "transportationStatus",
    icon: <AlternativeTransportIcon />,
    options: [
      {
        key: "loaner",
        icon: <LoanerIcon />,
        caption: "Loaner",
      },
      {
        key: "lyft",
        icon: <LyftIcon />,
        caption: "Lyft",
      },
      {
        key: "uber",
        icon: <UberIcon />,
        caption: "Uber",
      },
      {
        key: "shuttle",
        icon: <ShuttleIcon />,
        caption: "Shuttle",
      },
    ],
  },
  {
    key: "client_waiting",
    icon: <CoffeeIcon />,
  },
  {
    key: "with_concern",
    icon: <CarIcon />,
  },
  {
    key: "appraisal_requested",
    icon: <LabelIcon />,
  },
  {
    key: "with_recall",
    icon: <RecallIcon />,
  },
];
