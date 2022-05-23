import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bool, func, object } from "prop-types";
import { Redirect, useHistory } from "react-router-dom";
import { useQuery } from "shared/hooks";

import {
  authLoadingStateSelector, authErrorSelector, authUserDataSelector, authIsPasswordResetSelector,
} from "store/selectors/auth-selectors";
import { authenticateUserByResetToken, updateUserPassword } from "store/actions/auth-actions";

import Panel from "components/common/Panel";
import Input from "components/common/Input";
import Button from "components/common/Button";

import "./styles.scss";

const error401Text = "Authentication failed. Check if email and password are correct";

const ResetPasswordPage = ({
  // authenticateByResetToken,
  isLoading,
  apiError,
  // userData,
  updatePassword,
  isPasswordResetSuccess,
}) => {
  const [userState, setUserState] = useState({
    password: "",
    confirm_password: "",
    reset_password_token: "",
  });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState("");
  const history = useHistory();
  const query = useQuery();

  useEffect(() => {
    const resetToken = query.get("reset_password_token");
    if (resetToken) setUserState({ ...userState, reset_password_token: resetToken });
  }, []);

  // #todo come back when full Reset password flow would be done.
  // useEffect(() => {
  //   if (userData && userData.id) {
  //     setStep(step === "reset:valid" ? "reset:success" : "reset:valid");
  //   }
  // }, [userData])

  const stepToTitle = (step) => {
    switch (step) {
      case "reset:success": return "Your password was changed successfully!";
      case "reset:error": return "Error during password update";
      // default: return `Hello ${(userData && userData.first_name) || ''}! Please, enter new password.`
      default: return "Hello! Please, enter new password.";
    }
  };

  const validate = () => {
    const { password, confirm_password } = userState;
    const validationErrors = {
      password: (!password || password.length < 8) && "Password must be present and contain at least 8 signs.",
      confirm_password: (!confirm_password || confirm_password.length < 8) && "Confirm password must be present and contain at least 8 signs.",
      nomatch: confirm_password !== password && "Passwords have to match.",
    };
    setErrors(validationErrors);
    return !Object.values(validationErrors).find((v) => v);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      updatePassword(userState);
    }
  };

  /* eslint-disable consistent-return */
  const renderErrorMessage = (error) => {
    if (error && error.status === 401) {
      return error401Text;
    } if (error) {
      return error.data;
    }
  };
  /* eslint-enable */

  const isButtonDisabled = () => {
    const { password, confirm_password } = userState;
    return !password
      || !confirm_password
      || confirm_password !== password
      || isLoading;
  };

  if (!query.get("reset_password_token") || isPasswordResetSuccess) return <Redirect to="/login" />;

  return (
    <section className="conciergeLoginPage">
      <Panel header={(
        <h3 className="conciergeLoginPanelHeader">
          {stepToTitle(step)}
        </h3>
      )}
      >
        <form onSubmit={handleSubmit}>
          {/* {isLoading} */}
          {/* {step === "reset:valid" && ( */}
          <>
            <Input
              name="password"
              type="password"
              label="New password (8 characters)"
              value={userState.password}
              error={errors.password}
              onChange={(value) => setUserState((prevUserState) => ({ ...prevUserState, password: value }))}
            />
            <Input
              name="confirm_password"
              type="password"
              label="Confirm new password"
              value={userState.confirm_password}
              error={errors.nomatch || errors.confirm_password}
              onChange={(value) => setUserState((prevUserState) => ({ ...prevUserState, confirm_password: value }))}
            />
            <Button
              className="conciergeLoginButton"
              type="submit"
              disabled={isButtonDisabled()}
            >
              Save new password.
            </Button>
          </>
          {/* )} */}
          {step === "reset:success" && (
            <Button
              className="conciergeLoginButton"
              type="button"
              onClick={() => history.push("/login")}
            >
              Go to Log in.
            </Button>
          )}
          {
            apiError
              ? <div className="conciergeLoginApiError">{renderErrorMessage(apiError)}</div>
              : null
          }
        </form>
      </Panel>
    </section>
  );
};

ResetPasswordPage.propTypes = {
  isLoading: bool.isRequired,
  isPasswordReset: bool.isRequired,
  authenticateByResetToken: func.isRequired,
  // eslint-disable-next-line
  apiError: object,
};

ResetPasswordPage.defaultProps = {
  apiError: null,
};

const mapStateToProps = (state) => ({
  isLoading: authLoadingStateSelector(state),
  apiError: authErrorSelector(state),
  userData: authUserDataSelector(state),
  isPasswordResetSuccess: authIsPasswordResetSelector(state),
});

const actions = {
  authenticateByResetToken: authenticateUserByResetToken,
  updatePassword: updateUserPassword,
};

export default connect(mapStateToProps, actions)(ResetPasswordPage);
