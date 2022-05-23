import React, { useEffect } from "react";
import { connect } from "react-redux";
import "react-notifications/lib/notifications.css";
import { retrieveAdvisors } from "store/actions/settings-actions";

import AdvisorsPanel from "./AdvisorsPanel";
import DriversPanel from "./DriversPanel";

const CapacityTab = ({
  fetchAdvisors,
}) => {
  useEffect(() => { fetchAdvisors(); }, []);

  return (
    <>
      <AdvisorsPanel perPage={5} currentPage={0} />
      <DriversPanel perPage={5} currentPage={0} />
    </>
  );
};

const actions = {
  fetchAdvisors: retrieveAdvisors,
};

export default connect(null, actions)(CapacityTab);
