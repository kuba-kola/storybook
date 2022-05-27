import React, { useEffect, useState } from "react";
import {
  func, arrayOf, bool, string,
} from "prop-types";
import cx from "classnames";

import maintenanceIcon from "assets/images/bookings/maintenance.svg";
import concernIcon from "assets/images/bookings/concern.svg";
import otherIcon from "assets/images/bookings/other.svg";
import extensionIcon from "assets/images/bookings/service.svg";
import recallIcon from "assets/images/bookings/recall_icon.svg";
import { countSelectedServicesByType } from "shared/utils/common";
import { servicePropType, dealershipMenuItemsPropType } from "shared/prop-types";

import Panel from "components/common/Panel";
import Button from "components/common/Button";
import ServiceTypeToggler from "./ServiceTypeToggler";
import ServicesToSelect from "./ServicesToSelect";
import "./styles.scss";

const ChooseServices = ({
  dealershipMenuItems: {
    maintenance,
    concern,
    extension,
    recall,
    other,
  },
  retrieveDealershipMenuItems,
  selectedServices,
  setSchedulingStep,
  decisionTrees,
  menuItemsLoading,
  menuItemsLoadingError,
  makeServiceSelection,
  nextStep,
  isScheduler,
}) => {
  const [servicesToShow, setServicesToShow] = useState([]);
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    retrieveDealershipMenuItems();
  }, []);

  if (menuItemsLoading) {
    return <Panel className="conciergeSchedulingLoadingPanel">Loading...</Panel>;
  }

  return (
    <section className="chooseServicesContainer">
      {
        menuItemsLoadingError
          ? <Panel className="conciergeSchedulingLoadingPanel">Please try again.</Panel>
          : (
            <>
              <div className="chooseServicesTogglers">
                <ServiceTypeToggler
                  icon={maintenanceIcon}
                  label="Maintenance"
                  onClick={() => {
                    setServicesToShow(maintenance);
                    setActiveTab("maintenance");
                  }}
                  counter={countSelectedServicesByType("maintenance", selectedServices)}
                  isActive={activeTab === "maintenance"}
                  isScheduler={isScheduler}
                />
                <ServiceTypeToggler
                  icon={concernIcon}
                  label="Concern"
                  onClick={() => {
                    setServicesToShow(concern);
                    setActiveTab("concern");
                  }}
                  counter={countSelectedServicesByType("concern", selectedServices)}
                  isActive={activeTab === "concern"}
                  isScheduler={isScheduler}
                />
                {!isScheduler && (
                  <>
                    <ServiceTypeToggler
                      icon={extensionIcon}
                      label="Extension"
                      onClick={() => {
                        setServicesToShow(extension);
                        setActiveTab("extension");
                      }}
                      counter={countSelectedServicesByType("extension", selectedServices)}
                      isActive={activeTab === "extension"}
                    />
                    <ServiceTypeToggler
                      icon={otherIcon}
                      label="Other"
                      onClick={() => {
                        setServicesToShow(other);
                        setActiveTab("other");
                      }}
                      counter={countSelectedServicesByType("other", selectedServices)}
                      isActive={activeTab === "other"}
                    />
                    <ServiceTypeToggler
                      icon={recallIcon}
                      label="Recall"
                      onClick={() => {
                        setServicesToShow(recall);
                        setActiveTab("recall");
                      }}
                      counter={countSelectedServicesByType("recall", selectedServices)}
                      isActive={activeTab === "recall"}
                    />
                  </>
                )}

              </div>
              <ServicesToSelect
                servicesToShow={servicesToShow}
                selectedServices={selectedServices}
                makeServiceSelection={makeServiceSelection}
                decisionTrees={decisionTrees}
              />
              <div className="conciergeSchedulingSubmitWrapper">
                <Button
                  variant="brand"
                  disabled={!selectedServices.length}
                  onClick={() => setSchedulingStep(nextStep)}
                >
                  Done
                </Button>
              </div>
            </>
          )
      }
    </section>
  );
};

ChooseServices.propTypes = {
  dealershipMenuItems: dealershipMenuItemsPropType,
  selectedServices: arrayOf(servicePropType),
  makeServiceSelection: func.isRequired,
  setSchedulingStep: func.isRequired,
  retrieveDealershipMenuItems: func.isRequired,
  menuItemsLoading: bool.isRequired,
  menuItemsLoadingError: bool.isRequired,
  nextStep: string.isRequired,
  isScheduler: bool,
};

ChooseServices.defaultProps = {
  dealershipMenuItems: {},
  selectedServices: [],
  isScheduler: false,
};

export default ChooseServices;
