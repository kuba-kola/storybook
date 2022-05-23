import React, { useState } from "react";
import { connect } from "react-redux";
import { bool, func, object } from "prop-types";

import {
  authLoadingStateSelector, authErrorSelector, authIsPasswordResetSelector, authIsResetLinkSentSelector,
} from "store/selectors/auth-selectors";
import { authenticateUser, sendResetLinkToEmail, resetLoginData } from "store/actions/auth-actions";

import Panel from "components/common/Panel";
import Input from "components/common/Input";
import Button from "components/common/Button";

import "./styles.scss";

const error401Text = "Authentication failed. Check if email and password are correct";

const LoginPage = ({
  authenticate,
  isLoading,
  apiError,
  sendResetLink,
  resetLoginState,
  isResetLinkSent,
  isPasswordResetSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const stepToTitle = () => {
    if (isPasswordResetSuccess) return "You successfully reset your password. Please log in.";
    if (isResetLinkSent) {
      return (
        <span>
          Email sent.
          {" "}
          <br />
          Check your email inbox and open the link to continue.
        </span>
      );
    }
    if (isResetting) {
      return (
        <span>
          Please, enter your Email.
          {" "}
          <br />
          We will send you a link to reset your password.
        </span>
      );
    }
    return "Welcome to Carmen";
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    authenticate(email, password);
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

  const isButtonDisabled = !email || !password || isLoading;

  return (
    <section className="conciergeLoginPage">
      <Panel header={(
        <h3 className="conciergeLoginPanelHeader">
          {stepToTitle()}
        </h3>
      )}
      >
        <form onSubmit={handleSubmit}>
          {!isResetLinkSent && (
            <Input
              name="email"
              label="Your email address"
              value={email}
              onChange={(v) => setEmail(v)}
            />
          )}
          {!isResetting && (
            <>
              <Input
                name="password"
                type="password"
                label="Your Carmen password"
                value={password}
                onChange={(v) => setPassword(v)}
              />
              <Button
                className="conciergeLoginButton"
                type="submit"
                disabled={isButtonDisabled}
              >
                Log in
              </Button>
              <div className="conciergeLoginResetWrapper">
                <button
                  type="button"
                  onClick={() => setIsResetting(true)}
                  className="conciergeLoginReset"
                >
                  Reset password
                </button>
              </div>
            </>
          )}
          {isResetting && !isResetLinkSent && (
            <Button
              className="conciergeLoginButton"
              type="button"
              disabled={!email || isLoading}
              onClick={() => sendResetLink(email)}
            >
              Send link to email
            </Button>
          )}
          {isResetting && isResetLinkSent && (
            <Button
              className="conciergeLoginButton"
              type="button"
              onClick={() => {
                setIsResetting(false);
                resetLoginState();
              }}
            >
              Okay
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

LoginPage.propTypes = {
  isLoading: bool.isRequired,
  authenticate: func.isRequired,
  resetLoginState: func.isRequired,
  // eslint-disable-next-line
  apiError: object,
};

LoginPage.defaultProps = {
  apiError: null,
};

const mapStateToProps = (state) => ({
  isLoading: authLoadingStateSelector(state),
  isPasswordResetSuccess: authIsPasswordResetSelector(state),
  isResetLinkSent: authIsResetLinkSentSelector(state),
  apiError: authErrorSelector(state),

});

const actions = {
  authenticate: authenticateUser,
  sendResetLink: sendResetLinkToEmail,
  resetLoginState: resetLoginData,
};

const LoginPageContainer = connect(mapStateToProps, actions)(LoginPage);

export default LoginPageContainer;
