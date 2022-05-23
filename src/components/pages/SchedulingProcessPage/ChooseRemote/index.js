import React, { useState, useEffect } from "react";
import { string, object } from "prop-types";
import { isEmpty, isNil } from "ramda";
import { chosenTimeSlotPropType } from "shared/prop-types";
import RemotePanelAdditionalInfo from "./RemotePanelAdditionalInfo";

import "./styles.scss";

const Remote = ({ chosenTimeSlot, customerPickupAddress, customerPickupAddressData }) => {
  const [additionalInfo, setAdditionalInfo] = useState({
    pickUp: {
      date: "",
      time: "",
      address: customerPickupAddress,
      addressData: customerPickupAddressData,
      driver: {},
      coDriver: {},
      notes: "",
    },
    isSameLocation: false,
  });

  useEffect(() => {
    if (!isEmpty(chosenTimeSlot) && !isNil(chosenTimeSlot)) {
      setAdditionalInfo({
        ...additionalInfo,
        pickUp: {
          ...additionalInfo.pickUp,
          date: chosenTimeSlot.day.full_date,
          time: chosenTimeSlot.quarterSlot,
        },
      });
    }
  }, [chosenTimeSlot]);

  return (
    <RemotePanelAdditionalInfo
      additionalInfo={additionalInfo}
      setAdditionalInfo={setAdditionalInfo}
    />
  );
};

Remote.propTypes = {
  customerAddress: string,
  customerPickupAddressData: object,
  chosenTimeSlot: chosenTimeSlotPropType,
};

Remote.defaultProps = {
  chosenTimeSlot: null,
  customerAddress: "",
  customerPickupAddressData: null,
};

export default Remote;
