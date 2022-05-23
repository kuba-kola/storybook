import React, { useState, useEffect } from "react";
import { arrayOf, func } from "prop-types";
import cx from "classnames";
import unselectedIcon from "assets/images/add.svg";
import selectedIcon from "assets/images/checkmark.svg";
import { menuItemPropType, servicePropType } from "shared/prop-types";
import Input from "components/common/Input";
import { createPackageNamesList, isServiceAlreadySelected, doesServiceHasPackageIncluded } from "./utils";
import ConcernDecisionTree from "./ConcernDecisionTree";

const ServicesToSelect = ({ servicesToShow, selectedServices, makeServiceSelection }) => {
  const [disabledServices, setDisabledServices] = useState([]);

  const setSelectionList = (service) => {
    let newSelectedList = selectedServices;
    let newDisabledList = disabledServices;
    const packageItems = createPackageNamesList(service);

    if (isServiceAlreadySelected(selectedServices, service)) {
      newSelectedList = newSelectedList.filter((item) => item.name !== service.name);
      newDisabledList = newDisabledList.filter((packageItem) => (
        !packageItems.includes(packageItem)
      ));
    } else {
      newSelectedList.push(service);

      if (doesServiceHasPackageIncluded(service)) {
        newDisabledList.push(...packageItems);
        newSelectedList = newSelectedList.filter((item) => !packageItems.includes(item.name));
      }
    }

    setDisabledServices(newDisabledList);
    makeServiceSelection(newSelectedList);
  };

  const addToService = (service, key, value) => {
    let currentService = selectedServices.find((element) => element.name === service.name);
    const indexOfCurrentService = selectedServices.indexOf(currentService);

    currentService = {
      ...currentService,
      [key]: value,
    };

    const newSelectedServices = selectedServices;
    newSelectedServices.splice(indexOfCurrentService, 1, currentService);

    makeServiceSelection(newSelectedServices);
  };

  const isServiceSelected = (service) => (
    selectedServices.filter((item) => item.name === service.name).length > 0
  );

  useEffect(() => {
    const newDisabledList = disabledServices;

    selectedServices.map((selectedService) => {
      if (doesServiceHasPackageIncluded(selectedService)) {
        const packageItems = createPackageNamesList(selectedService);
        newDisabledList.push(...packageItems);
      }
      return selectedService;
    });
    setDisabledServices(newDisabledList);
  }, []);

  return (
    <>
      {
        servicesToShow && servicesToShow.map((service) => (
          <div
            key={service.id}
            className={cx("service", {
              selected: isServiceSelected(service),
              disabled: disabledServices.includes(service.name),
            })}
          >
            <button
              className="serviceTopLineContainer"
              type="button"
              onClick={() => setSelectionList(service)}
              disabled={disabledServices.includes(service.name)}
            >
              <div className="serviceInfoContainer">
                <span className="serviceCaption">{service.name}</span>
                {!!service.package_items.length && (
                  <div className="packageItemsContainer">
                    <span> package contains: </span>
                    {service.package_items.map((item) => (
                      <span key={item.name}>{item.name}</span>
                    ))}
                  </div>
                )}
                {!!service.extras.length && (
                  <div className="packageItemsContainer">
                    {service.extras.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                )}
              </div>
              {isServiceSelected(service)
                ? (
                  <div className="selectedIcon">
                    <img src={selectedIcon} alt="Selected" />
                  </div>
                )
                : (
                  <div className="unselectedIcon">
                    <img src={unselectedIcon} alt="Unselected" />
                  </div>
                )}
            </button>
            {(isServiceSelected(service) && service.kind === "concern") && (
              <>
                {service.decision_tree ? (
                  <ConcernDecisionTree
                    service={service}
                    decisionTreeDetails={selectedServices.find((selected) => selected.name === service.name).decisionTreeDetails}
                    onChange={(value) => addToService(service, "decisionTreeResult", value)}
                  />
                )
                  : null}
                <Input
                  placeholder="Additional information"
                  type="text"
                  inputClassName=""
                  value={selectedServices.find((selected) => selected.name === service.name).additionalInfo}
                  onClick={(e) => e.stopPropagation(e)}
                  onChange={(value) => addToService(service, "additionalInfo", value)}
                  maxLength={50}
                />
              </>
            )}
          </div>
        ))
      }
    </>
  );
};

ServicesToSelect.propTypes = {
  servicesToShow: menuItemPropType.isRequired,
  selectedServices: arrayOf(servicePropType),
  makeServiceSelection: func.isRequired,
};

ServicesToSelect.defaultProps = {
  selectedServices: [],
};

export default ServicesToSelect;
