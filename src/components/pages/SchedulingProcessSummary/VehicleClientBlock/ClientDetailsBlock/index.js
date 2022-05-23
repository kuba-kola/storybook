import React from "react";
import { object } from "prop-types";

import "./styles.scss";

const ClientDetailsBlock = ({ customer }) => (
  <section className="conciergeClientDetailsBlock">
    <div className="conciergeClientDetailsBlockGroup">
      <div className="conciergeClientDetailsBlockItem">
        <div className="conciergeClientDetailsBlockLabel">
          Customer
        </div>
        <div className="conciergeClientDetailsBlockValue">
          {customer ? (`${customer?.first_name} ${customer?.last_name}`) : ("-")}
        </div>
      </div>
      <div className="conciergeClientDetailsBlockItem">
        <div className="conciergeClientDetailsBlockLabel">
          Phone
        </div>
        <div className="conciergeClientDetailsBlockValue">
          {customer?.phone_number || "-"}
        </div>
      </div>
      <div className="conciergeClientDetailsBlockItem">
        <div className="conciergeClientDetailsBlockLabel">
          Email
        </div>
        <div className="conciergeClientDetailsBlockValue">
          {customer?.email || "-"}
        </div>
      </div>
    </div>
  </section>
);

ClientDetailsBlock.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  customer: object,
};

ClientDetailsBlock.defaultProps = {
  customer: null,
};

export default ClientDetailsBlock;
