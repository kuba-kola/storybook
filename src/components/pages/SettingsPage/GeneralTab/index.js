import React from "react";
import { dealershipInfoPropType } from "shared/prop-types";
import Panel from "components/common/Panel";

import GeneralPanel from "./GeneralPanel";
import KiosksPanel from "./KiosksPanel";
import TvScreensPanel from "./TvScreensPanel";
import ArriveUsersPanel from "./ArriveUsersPanel";
import RemoteUsersPanel from "./RemoteUsersPanel";
import IntegrationsPanel from "./IntegrationsPanel";

const GeneralTab = ({
  dealershipInfo,
  dealershipInfo: {
    id,
    kiosks,
    tv_screens,
    arrive_users,
    remote_users,
    integrations,
  },
}) => {
  const renderWidgetCodeLines = () => (
    [`<div id="concierge-dealership-id" dealership-id="${id}" style="display: none;"></div>`,
      "<div id=\"concierge-root\" style=\"position: fixed; bottom: 24px; right: 24px; z-index: 999999;\"></div>",
      "<script async src=\"https://reserve.getcarmen.com/widget/embed.js\" type=\"text/javascript\"></script>",
      "<link href=\"https://reserve.getcarmen.com/widget/stylesheet.css\" rel=\"stylesheet\" type=\"text/css\" />"]
  );

  const renderInlineWidgetCodeLines = (noBg) => (
    [`<div id="concierge-dealership-id" dealership-id="${id}" flat-mode ${noBg ? "no-bg-welcome-screen" : ""}></div>`,
      "<div id=\"concierge-root\" style=\"width: 100%; height: 100%;\"></div>",
      "<script async src=\"https://reserve.getcarmen.com/widget/embed.js\" type=\"text/javascript\"></script>",
      "<link href=\"https://reserve.getcarmen.com/widget/stylesheet.css\" rel=\"stylesheet\" type=\"text/css\" />"]
  );

  return (
    <>
      <GeneralPanel dealershipInfo={dealershipInfo} />
      <ArriveUsersPanel users={arrive_users} />
      <RemoteUsersPanel users={remote_users} />
      <TvScreensPanel tvScreens={tv_screens} />
      <KiosksPanel kiosks={kiosks} />
      <IntegrationsPanel integrations={integrations} />
      <Panel
        header={<p className="conciergeBookingDetailsPanelHeader">Info</p>}
      >
        <div className="conciergeSettingsPageInfo">
          In order to embed the Widget on a third party website the following
          snippet needs to be inserted in the website&apos;s body.
          <h3>ChatBot Widget:</h3>
          <div className="conciergeSettingsPageInfoCodeContainer">
            {renderWidgetCodeLines().map((line) => <code>{line}</code>)}
          </div>
          <h3>Inline Widget:</h3>
          <div className="conciergeSettingsPageInfoCodeContainer">
            {renderInlineWidgetCodeLines().map((line) => <code>{line}</code>)}
          </div>

          <h3>Inline Widget without background on welcome screen:</h3>
          <div className="conciergeSettingsPageInfoCodeContainer">
            {renderInlineWidgetCodeLines(true).map((line) => <code>{line}</code>)}
          </div>

        </div>
      </Panel>
    </>
  );
};

GeneralTab.propTypes = {
  dealershipInfo: dealershipInfoPropType,
};

GeneralTab.defaultProps = {
  dealershipInfo: null,
};

export default GeneralTab;
