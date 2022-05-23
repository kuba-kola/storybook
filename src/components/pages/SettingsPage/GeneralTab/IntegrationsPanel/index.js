import React from "react";
import { arrayOf, func } from "prop-types";
import { isEmpty, isNil } from "ramda";
import { integrationPropType } from "shared/prop-types";
import Panel from "components/common/Panel";

import Integration from "./Integration";
import DmsIntegration from "./DmsIntegration";
import LoanerIntegration from "./LoanerIntegration";
import RemoteIntegration from "./RemoteIntegration";

const IntegrationsPanel = ({ integrations, isSuperAdmin, onAddIntegrationClick }) => {
  const dmsIntegration = integrations.find((el) => el.kind === "dealer_track" || el.kind === "cdk");
  const loanerIntegration = integrations.find((el) => el.kind === "loaner");
  const remoteIntegration = integrations.find((el) => el.kind === "remote");
  const regularIntegrations = integrations
    .filter((el) => el.kind !== "dealer_track" && el.kind !== "cdk" && el.kind !== "loaner" && el.kind !== "remote");

  return (
    <Panel header={<p className="conciergeBookingDetailsPanelHeader">Integrations</p>}>
      {(isEmpty(integrations) || isNil(integrations)) && (
        <p>No integrations found</p>
      )}
      {(dmsIntegration || regularIntegrations) && (
        <>
          {dmsIntegration && (
            <DmsIntegration integration={dmsIntegration} isSuperAdmin={isSuperAdmin} />
          )}
          {loanerIntegration && (
            <LoanerIntegration integration={loanerIntegration} isSuperAdmin={isSuperAdmin} />
          )}
          {remoteIntegration && (
            <RemoteIntegration integration={remoteIntegration} isSuperAdmin={isSuperAdmin} />
          )}
          {regularIntegrations.map((integration) => (<Integration {...integration} isSuperAdmin={isSuperAdmin} />))}
        </>
      )}
      {isSuperAdmin && (
        <section className="conciergeDealershipDetailsIntegrationsPanelAddIntegration">
          <button
            type="button"
            className="conciergeDealershipDetailsIntegrationsPanelAddIntegrationButton"
            onClick={onAddIntegrationClick}
          >
            Add new integration
          </button>
        </section>
      )}
    </Panel>
  );
};

IntegrationsPanel.propTypes = {
  updateServiceWriter: func,
  integrations: arrayOf(integrationPropType),
};

IntegrationsPanel.defaultProps = {
  updateServiceWriter: null,
  integrations: [],
};

export default IntegrationsPanel;
