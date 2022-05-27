import React, { useState, useEffect } from "react";
import { object } from "prop-types";

import Panel from "components/common/Panel";
import Button from "components/common/Button";
import Block from "components/common/Block";

import AlternativeTransportationColumn from "./AlternativeTransportationColumn";

import "./styles.scss";

const statusOptions = [];

const AlternativeTransportationPanel = ({ booking: { transport } }) => {
  const [chosenOption, setChosenOption] = useState("");

  const title = (
    <>
      <p className="conciergeBookingDetailsPanelHeader">
        Alternative transportation
      </p>
      <span className="conciergeBookingDetailsPanelSelectedOption">
        {chosenOption}
      </span>
    </>
  );

  const statusLabels = {
    loaner: "Loaner",
    lyft: "Lyft",
    uber: "Uber",
    shuttle: "Shuttle",
  };

  useEffect(() => {
    if (transport && transport.kind) {
      setChosenOption(statusLabels[transport.kind]);
    }
  }, [transport]);

  return (
    <Panel
      className="conciergeBookingDetailsPanel"
      header={title}
      isToggle
    >
      {/* <Block className="conciergeBookingDetailsPanel">
        <section className="conciergeDropdownBlockContainer">
          <AlternativeTransportationColumn
            label="Preference"
            options={statusOptions}
            placeholder="None"
            readOnly
          />
          <AlternativeTransportationColumn
            label="Loaner vehicle"
            options={statusOptions}
            placeholder="None"
            readOnly
          />
        </section>
      </Block>
      <Button
        className="conciergeButtonApply AlternativeTransportation"
        onClick={() => {}}
      >
        Apply
      </Button> */}
    </Panel>
  );
};

AlternativeTransportationPanel.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  booking: object,
};

AlternativeTransportationPanel.defaultProps = {
  booking: null,
};

export default AlternativeTransportationPanel;
