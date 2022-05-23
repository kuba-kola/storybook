import React from "react";
import {
  string, bool, shape, number, oneOfType,
} from "prop-types";
import { Link } from "react-router-dom";
import cx from "classnames";
import WarningIcon from "assets/images/exclamation-triangle.svg";

import "./styles.scss";

export const CapitalisedCell = ({ value }) => (
  <div className="conciergeTableCapitalisedCell">
    {value}
  </div>
);

CapitalisedCell.propTypes = {
  value: string.isRequired,
};

export const StatusCell = ({ value }) => {
  const indicatorClasses = cx(
    "conciergeTableStatusIndicator",
    `conciergeTableStatusIndicator-${value}`,
  );
  return (
    <div className="conciergeTableStatusCell">
      <div className={indicatorClasses} />
      <div>{value}</div>
    </div>
  );
};

StatusCell.propTypes = {
  value: string.isRequired,
};

export const StatusIconCell = ({ value }) => (
  <div className={cx("conciergeTableStatusIconCell", { isActive: value })}>
    <div className="conciergeTableStatusIcon__outer">
      <div className="conciergeTableStatusIcon__inner" />
    </div>
    <span>{value ? "Active" : "Inactive"}</span>
  </div>
);

StatusIconCell.propTypes = {
  value: bool.isRequired,
};

export const LinkCell = ({ value }) => (
  <div className="conciergeTableLinkCell">
    <Link to={value.href}>{value.text}</Link>
  </div>
);

LinkCell.propTypes = {
  value: shape({
    href: string.isRequired,
    text: string.isRequired,
  }).isRequired,
};

export const IdNumberCell = ({ value: { idNumber, withConcern } }) => {
  const indicatorClass = withConcern ? "conciergeTableIdNumberCellConcernIndicator" : "";
  return (
    <div className="conciergeTableIdNumberCell">
      <div>{idNumber}</div>
      <div className={indicatorClass} />
    </div>
  );
};

IdNumberCell.propTypes = {
  value: shape({
    idNumber: number.isRequired,
    withConcern: bool.isRequired,
  }).isRequired,
};

export const AppraisalRequestedCell = ({ value }) => {
  const appraisalRequestedText = value === true ? "Yes" : "-";
  const cellClassName = cx(
    "conciergeTableAppraisalRequestedCell",
    { conciergeTableAppraisalRequestedCellWithText: value },
  );

  return (
    <div className={cellClassName}>
      {appraisalRequestedText}
    </div>
  );
};

AppraisalRequestedCell.propTypes = {
  value: bool.isRequired,
};

export const CustomerCell = ({
  customer,
  vehicle: { make, model, model_year },
  vehicleImgUrl,
}) => (
  <div className="conciergeTableCustomerCell">
    <div>
      <div className="customer">
        {customer}
      </div>
      <div className="vehicle">
        {make ? `${model_year} ${make} ${model}` : "-"}
      </div>
    </div>
    {vehicleImgUrl && (
      <img
        src={vehicleImgUrl}
        alt="vehicle"
        className="vehicleImg"
      />
    )}
  </div>
);

CustomerCell.propTypes = {
  customer: string.isRequired,
  vehicle: shape({
    make: string.isRequired,
    model: string.isRequired,
    model_year: oneOfType([string, number]).isRequired,
  }).isRequired,
  vehicleImgUrl: string,
};

CustomerCell.defaultProps = {
  vehicleImgUrl: "",
};

export const RepairOrderCell = ({ repair_order_number, repair_order_tag }) => (
  <div className="conciergeTableRepairOrderCell">
    <div>
      <div className="repairOrderNumber">
        {repair_order_number}
      </div>
      {repair_order_tag && (
        <div className="repairOrderTag">
          Tag:
          {" "}
          {repair_order_tag}
        </div>
      )}
    </div>
  </div>
);

RepairOrderCell.propTypes = {
  repair_order_number: string,
  repair_order_tag: string,
};

RepairOrderCell.defaultProps = {
  repair_order_number: null,
  repair_order_tag: null,
};

export const MadeByCell = ({
  source,
  made_by_name,
  made_by_role,
}) => (
  <div className="conciergeTableMadeByCell">
    <div>
      <div className="source">
        {source}
      </div>
      {made_by_name && (
        <div className="createdByName">
          {made_by_name}
        </div>
      )}
      {made_by_role && (
        <div className="createdByRole">
          {made_by_role}
        </div>
      )}
    </div>
  </div>
);

MadeByCell.propTypes = {
  source: string,
  made_by_name: string,
  made_by_role: string,
};

MadeByCell.defaultProps = {
  source: null,
  made_by_name: null,
  made_by_role: string,
};

export const AppArrivedTimeCell = ({
  appTime,
  arrivedTime,
  hasWarning,
  isLate,
}) => (
  <div className="conciergeTableAppArrivedTimeCell">
    <div>
      <div className={cx("appTime", { error: isLate })}>
        {appTime}
      </div>
      <div className="arrivedTime">
        {arrivedTime}
      </div>
    </div>
    {hasWarning && (
      <img
        src={WarningIcon}
        alt=""
        className="conciergeTableAppArrivedTimeCellWarning"
      />
    )}
  </div>
);

AppArrivedTimeCell.propTypes = {
  appTime: oneOfType([string, number]).isRequired,
  isLate: bool.isRequired,
  hasWarning: bool.isRequired,
  arrivedTime: oneOfType([string, number]),
};

AppArrivedTimeCell.defaultProps = {
  arrivedTime: "—",
};
