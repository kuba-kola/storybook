import React, { useState } from "react";
import { object } from "prop-types";
import { isEmpty } from "ramda";
import Block from "components/common/Block";

import downIcon from "assets/images/down.svg";
import upIcon from "assets/images/up.svg";

import "../styles.scss";
import serviceIconsMap from "shared/serviceIconsMap";

const SelectedServices = ({ services }) => {
  const [openItemIndex, setOpenItemIndex] = useState(null);

  if (isEmpty(services)) {
    return (
      <section>
        <Block>
          No services specified
        </Block>
      </section>
    );
  }

  return (
    <section>
      {services.map((menuItem, index) => {
        const isCurrentlySelected = openItemIndex === index;
        return (
          <section key={menuItem.id}>
            <div className="bookingDetailsSection">
              <div className="bookingDetailsService">
                <img
                  src={
                  serviceIconsMap[menuItem.kind]
                  || (menuItem.operation_code && serviceIconsMap.recall)
                }
                  className="appointmentDetailsServiceIcon"
                  alt=""
                />
              </div>
              <div className="bookingDetailsService">
                <span className="bookingDetailsServiceName">{menuItem.name}</span>
                <div className="bookingDetailsServicePrice">
                  <span className="bookingDetailsServicePriceSmallGrayText">Price:</span>
                  <span className="bookingDetailsServicePriceValue">{`$${menuItem.fee}`}</span>
                </div>
              </div>
              <div className="bookingDetailsService bookingDetailsServiceToggle">
                <img
                  className="conciergeBookedServiceAccordionItemToggleButton"
                  src={isCurrentlySelected ? upIcon : downIcon}
                  alt="concierge toggle"
                  onClick={() => setOpenItemIndex(openItemIndex === index ? null : index)}
                />
              </div>
            </div>
            {isCurrentlySelected ? (
              <section className="bookingDetailsServiceAccordionItemContent">
                {menuItem.decisionTreeResult && Object.entries(menuItem.decisionTreeResult).map(([key, value], index) => (
                  <section className="bookingDetailsServiceAccordionItemQuestionBlock" key={key + index}>
                    <span className="bookingDetailsServiceAccordionItemQuestionBlockLabel">
                      {index + 1}
                      {". "}
                    </span>
                    <span className="bookingDetailsServiceAccordionItemQuestionBlockValue">{`${key} /`}</span>
                    <span className="bookingDetailsServiceAccordionItemQuestionBlockAnswer">{value}</span>
                  </section>
                ))}
                {menuItem.additionalInfo ? (
                  <section className="bookingDetailsServiceAccordionItemQuestionBlock">
                    <span className="bookingDetailsServiceAccordionItemQuestionBlockValue">
                      Customer States:
                    </span>
                    <span className="bookingDetailsServiceAccordionItemQuestionBlockAnswer">
                      {menuItem.additionalInfo}
                    </span>
                  </section>
                ) : null}
              </section>
            ) : null}
          </section>
        );
      })}
    </section>
  );
};

SelectedServices.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  services: object,
};

SelectedServices.defaultProps = {
  services: null,
};

export default SelectedServices;
