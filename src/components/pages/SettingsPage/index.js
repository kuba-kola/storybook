import React, { useEffect, useState } from "react";
import {
  func, object, string, bool,
} from "prop-types";
import { connect } from "react-redux";
import { isEmpty, isNil, or } from "ramda";
import cx from "classnames";

import { usePrevious } from "shared/hooks";
import { authTokenSelector } from "store/selectors/auth-selectors";
import { dealershipIdSelector } from "store/selectors/app-selectors";
import {
  settingsLoadingStateSelector,
  settingsDataSelector,
  settingsErrorSelector,
} from "store/selectors/settings-selectors";
import { retrieveDealershipInfo, retrieveTeamTags } from "store/actions/settings-actions";
import Panel from "components/common/Panel";
import PageHeader from "components/common/PageHeader";
import GeneralTab from "./GeneralTab";
import CapacityTab from "./CapacityTab";
import ColorSchemeTab from "./ColorSchemeTab";
import TeamTab from "./TeamTab";

import "./styles.scss";

const TAB_GENERAL = "TAB_GENERAL";
const TAB_CAPACITY = "TAB_CAPACITY";
const TAB_COLOR_SCHEME = "TAB_COLOR_SCHEME";
const TAB_TEAM = "TAB_TEAM";

const TABS = [
  {
    id: TAB_GENERAL,
    name: "General",
  },
  {
    id: TAB_CAPACITY,
    name: "Capacity",
  },
  {
    id: TAB_COLOR_SCHEME,
    name: "Color Scheme",
  },
  {
    id: TAB_TEAM,
    name: "Team",
  },
];

const PageTitle = () => <h2>Settings</h2>;

const SettingsPage = ({
  fetchDealershipInfo,
  fetchTeamTags,
  getOpCodes,
  dealershipId,
  token,
  dealershipInfo,
  isLoading,
  error,
}) => {
  const [tab, setTab] = useState(TAB_GENERAL);

  const previousDealershipId = usePrevious(dealershipId);

  useEffect(() => {
    if (dealershipId && !isLoading) {
      fetchDealershipInfo(dealershipId, token);
      fetchTeamTags();
    }
  }, []);

  useEffect(() => {
    if (
      (or(isEmpty(dealershipInfo), isNil(dealershipInfo)) && dealershipId && !isLoading && !error)
      || (dealershipId && dealershipId !== previousDealershipId)
    ) {
      fetchDealershipInfo(dealershipId, token);
    }
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <Panel className="conciergeBookingDetailsLoadingPanel">Loading...</Panel>;
    }
    if (error) {
      return <Panel className="conciergeBookingDetailsLoadingPanel">{error.data.error || error.data}</Panel>;
    }
    return (
      <>
        <section className="conciergeSettingsPageNavbar">
          <div>
            {TABS.map(({ id, name }) => (
              <button
                key={id}
                type="button"
                className={cx("conciergeSettingsPageNavbarTab", { active: tab === id })}
                onClick={() => setTab(id)}
              >
                {name}
              </button>
            ))}
          </div>
        </section>
        <section className="conciergeSettingsPageBody">
          {tab === TAB_GENERAL && (
            <GeneralTab dealershipInfo={dealershipInfo} />
          )}
          {tab === TAB_CAPACITY && (
            <CapacityTab capacitySettings={dealershipInfo.capacity_settings} />
          )}
          {tab === TAB_COLOR_SCHEME && (
            <ColorSchemeTab dealershipColorScheme={dealershipInfo.stylesheet} />
          )}
          {tab === TAB_TEAM && (
            <TeamTab dealershipInfo={dealershipInfo} />
          )}
        </section>
      </>
    );
  };

  return (
    <section className="conciergeSettingsPage">
      <PageHeader
        title={<PageTitle />}
      />
      <section className="conciergeSettingsPageMain">
        {renderContent()}
      </section>
    </section>
  );
};

SettingsPage.propTypes = {
  fetchDealershipInfo: func,
  getOpCodes: func,
  fetchTeamTags: func,
  token: string.isRequired,
  dealershipId: string,
  isLoading: bool,
  /* eslint-disable react/forbid-prop-types */
  dealershipInfo: object,
  error: object,
};

SettingsPage.defaultProps = {
  fetchDealershipInfo: null,
  getOpCodes: null,
  fetchTeamTags: null,
  dealershipId: null,
  isLoading: false,
  dealershipInfo: null,
  error: null,
};

const mapStateToProps = (state) => ({
  dealershipInfo: settingsDataSelector(state),
  isLoading: settingsLoadingStateSelector(state),
  error: settingsErrorSelector(state),
  token: authTokenSelector(state),
  dealershipId: dealershipIdSelector(state),
});

const actions = {
  fetchDealershipInfo: retrieveDealershipInfo,
  fetchTeamTags: retrieveTeamTags,
};

export default connect(mapStateToProps, actions)(SettingsPage);
