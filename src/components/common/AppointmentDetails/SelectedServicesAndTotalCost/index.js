import React from "react";
import { arrayOf, object } from "prop-types";

import { servicePropType } from "shared/prop-types";
import { totalCost, totalServiceTime } from "shared/utils/common";
import serviceIconsMap from "shared/serviceIconsMap";
import PackageItems from "../../PackageItems/PackageItems";

const SelectedServicesAndTotalCost = ({ selectedServices }) => (
  <>
    <div className="appointmentDetailsSectionHeader">
      Services
    </div>
    <div className="appointmentDetailsServices">
      {selectedServices.map((service) => (
        <div className="appointmentDetailsService" key={service.name}>
          <img src={serviceIconsMap[service.kind] || (service.operation_code && serviceIconsMap.recall)} className="appointmentDetailsServiceIcon" alt="" />
          <div className="appointmentDetailsServiceBody">
            <span className="appointmentDetailsServiceName">{service.name}</span>
            {service.package_items && !!service.package_items.length && (
              <PackageItems packageItems={service.package_items} extras={service.extras} />
            )}

            <div className="appointmentDetailsServicePrice">
              <span className="appointmentDetailsServiceSmallGrayText">Price:</span>
              <span className="appointmentDetailsServicePriceValue">{`$${typeof service.fee === "number" ? service.fee : service.price}`}</span>
            </div>
            {service.decisionTreeResult && Object.entries(service.decisionTreeResult).map(([key, value]) => (
              <section className="appointmentDetailsServiceAdditionalInfoRow">
                <span className="appointmentDetailsServiceAdditionalInfoKey">{key}</span>
                <span className="appointmentDetailsServiceAdditionalInfoValue">{value}</span>
              </section>
            ))}
            {service.additionalInfo && (
              <div className="appointmentDetailsServiceAdditionalInfo">
                <span className="appointmentDetailsServiceAdditionalInfoKey">Customer states:</span>
                <span className="appointmentDetailsServiceAdditionalInfoValue">{service.additionalInfo}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
    <div className="appointmentDetailsSectionHeader">
      Total
    </div>
    <div className="appointmentDetailsSection">
      <div className="appointmentDetailsTotal">{`$${totalCost(selectedServices)}`}</div>
      {/* <div className="appointmentDetailsTimeInfoSpans">
        <span className="appointmentDetailsServiceSmallGrayText">
          Estimated service time:
        </span>
        <span>
          {`${totalServiceTime(selectedServices)} hours`}
        </span>
      </div> */}
    </div>

  </>
);

SelectedServicesAndTotalCost.propTypes = {
  selectedServices: arrayOf(servicePropType),
  decisionTreeResults: arrayOf(object),
};

SelectedServicesAndTotalCost.defaultProps = {
  selectedServices: [],
  decisionTreeResults: [],
};

export default SelectedServicesAndTotalCost;
