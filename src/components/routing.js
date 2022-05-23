import React from "react";
import { Route, Redirect, withRouter } from "react-router-dom";
import {
  string, number, func, objectOf, object,
} from "prop-types";
import { connect } from "react-redux";

import LoginPage from "components/pages/LoginPage";
import ResetPasswordPage from "components/pages/ResetPasswordPage";
import BookingsPage from "components/pages/BookingsPage";
import BookingDetailsPage from "components/pages/BookingDetailsPage";
import MenuTemplatesPage from "components/pages/MenuTemplatesPage";
import MenuTemplatePage from "components/pages/MenuTemplatePage";
import SchedulingPage from "components/pages/SchedulingPage";
import SettingsPage from "components/pages/SettingsPage";
import DealershipsPage from "components/pages/DealershipsPage";
import DealershipDetailsPage from "components/pages/DealershipDetailsPage";
import SchedulingProcessPage from "components/pages/SchedulingProcessPage";
import SchedulingProcessSummary from "components/pages/SchedulingProcessSummary";
import { dealershipIdSelector, dealershipMakeModelYearMapSelector } from "store/selectors/app-selectors";
import { authTokenSelector, authRoleSelector } from "store/selectors/auth-selectors";
import { ADMIN_ROLE, ADVISOR_ROLE, BDC_ROLE } from "shared/constants";
import { retrieveMakeModelYearMap } from "store/actions/app-actions";
import { getOpCodes } from "store/actions/menu-template-actions";
import { retrieveDealershipInfo, retrieveTeamTags } from "store/actions/settings-actions";
import { isNil } from "ramda";

const routes = [
  {
    path: "/",
    component: null,
    redirectPath: "/bookings",
    adminRedirectPath: "/dealerships",
  },
  {
    path: "/login",
    component: <LoginPage />,
    redirectPath: "/bookings",
    adminRedirectPath: "/dealerships",
  },
  {
    path: "/reset",
    component: <ResetPasswordPage />,
    redirectPath: "/bookings",
    adminRedirectPath: "/dealerships",
  },
  {
    path: "/bookings",
    component: (() => (
      <>
        <Route exact path="/bookings" component={BookingsPage} />
        <Route path="/bookings/:guid/:kind" component={BookingDetailsPage} />
      </>
    ))(),
    redirectPath: "/login",
  },
  {
    path: "/templates",
    component: (() => (
      <>
        <Route exact path="/templates" component={MenuTemplatesPage} />
        <Route path="/templates/:id" component={MenuTemplatePage} />
      </>
    ))(),
    redirectAdvisorPath: "/bookings",
    redirectPath: "/login",
  },
  {
    path: "/scheduling",
    component: (() => (
      <>
        <Route exact path="/scheduling" component={SchedulingPage} />
        <Route path="/scheduling/process" component={SchedulingProcessPage} />
        <Route path="/scheduling/summary" component={SchedulingProcessSummary} />
      </>
    ))(),
    redirectPath: "/login",
  },
  {
    path: "/settings",
    component: <SettingsPage />,
    redirectAdvisorPath: "/bookings",
    redirectPath: "/login",
  },
  {
    path: "/dealerships",
    component: (() => (
      <>
        <Route exact path="/dealerships" component={DealershipsPage} />
        <Route path="/dealerships/:id" component={DealershipDetailsPage} />
      </>
    ))(),
    redirectPath: "/bookings",
  },
];

const Routing = ({
  token,
  role,
  makeModelYearMap,
  dealershipId,
  fetchMakeModelYearMap,
  fetchGetOpCodes,
  fetchDealershipInfo,
  fetchTeamTags,
}) => {
  const isLoggedIn = Boolean(token);
  const isAdvisor = role === ADVISOR_ROLE;
  const isBDC = role === BDC_ROLE;
  const isAdmin = role === ADMIN_ROLE;

  if (isLoggedIn && !isAdmin && dealershipId && isNil(makeModelYearMap)) {
    fetchMakeModelYearMap();
    fetchGetOpCodes();
    fetchDealershipInfo(dealershipId, token);
    fetchTeamTags(dealershipId, token);
  }

  const routesToRender = routes.map((route) => {
    switch (route.path) {
      case "/":
        return (
          <Route
            exact
            path={route.path}
            render={() => (
              <Redirect
                to={isAdmin ? route.adminRedirectPath : { pathname: route.redirectPath }}
              />
            )}
            key={route.path}
          />
        );
      case "/reset":
        return (
          <Route
            exact
            path={route.path}
            render={() => route.component}
            key={route.path}
          />
        );
      case "/login": {
        return (
          <Route
            path={route.path}
            render={() => {
              if (isLoggedIn) {
                return (
                  <Redirect
                    to={isAdmin ? route.adminRedirectPath : { pathname: route.redirectPath }}
                  />
                );
              }
              return route.component;
            }}
            key={route.path}
          />
        );
      }
      case "/dealerships":
        return (
          <Route
            path={route.path}
            render={() => {
              if (isLoggedIn) {
                return isAdmin ? route.component : <Redirect to={route.redirectPath} />;
              }
              return <Redirect to="/login" />;
            }}
            key={route.path}
          />
        );
      default:
        return (
          <Route
            path={route.path}
            render={() => {
              if (isLoggedIn) {
                if (isAdmin) return <Redirect to="/dealerships" />;
                if ((isBDC || isAdvisor) && ["/templates", "/settings"].includes(route.path)) {
                  return (
                    <Redirect to={{
                      pathname: route.redirectAdvisorPath,
                    }}
                    />
                  );
                }
                return route.component;
              }
              return (
                <Redirect
                  to={{
                    pathname: route.redirectPath,
                  }}
                />
              );
            }}
            key={route.path}
          />
        );
    }
  });
  return (
    <>
      {routesToRender}
    </>
  );
};

Routing.propTypes = {
  token: string.isRequired,
  role: string.isRequired,
  dealershipId: number.isRequired,
  fetchMakeModelYearMap: func.isRequired,
  fetchDealershipInfo: func.isRequired,
  fetchTeamTags: func.isRequired,
  fetchGetOpCodes: func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  makeModelYearMap: objectOf(object),
};
Routing.defaultProps = {
  makeModelYearMap: null,
};

const mapStateToProps = (state) => ({
  token: authTokenSelector(state),
  role: authRoleSelector(state),
  dealershipId: dealershipIdSelector(state),
  makeModelYearMap: dealershipMakeModelYearMapSelector(state),
});

const actions = {
  fetchMakeModelYearMap: retrieveMakeModelYearMap,
  fetchDealershipInfo: retrieveDealershipInfo,
  fetchTeamTags: retrieveTeamTags,
  fetchGetOpCodes: getOpCodes,
};

export default withRouter(connect(mapStateToProps, actions)(Routing));
