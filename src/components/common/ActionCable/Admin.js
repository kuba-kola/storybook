import { connect } from "react-redux";

import { actionCableListener } from "store/actions/app-actions";
import { authTokenSelector, authChannelKeySelector } from "store/selectors/auth-selectors";

import ActionCable from "./index";

const mapStateToProps = (state) => ({
  authToken: authTokenSelector(state),
  channelKey: authChannelKeySelector(state),
});

const actions = {
  onReceive: actionCableListener,
};

export default connect(mapStateToProps, actions)(ActionCable);
