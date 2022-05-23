import React from "react";
import { dealershipInfoPropType } from "shared/prop-types";

import TeamTagsPanel from "./TeamTagsPanel";
import EmployeesPanel from "./EmployeesPanel";
import DailyTeamCapacity from "./DailyTeamCapacity";

const TeamTab = ({
  dealershipInfo: {
    employments,
  },
}) => (
  <>
    <DailyTeamCapacity />
    <EmployeesPanel employments={employments} />
    <TeamTagsPanel />
  </>
);

TeamTab.propTypes = {
  dealershipInfo: dealershipInfoPropType,
};

TeamTab.defaultProps = {
  dealershipInfo: null,
};

export default TeamTab;
