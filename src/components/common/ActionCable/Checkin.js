import { connect } from "react-redux";

import { actionCableListener } from "store/actions/checkin-app-actions";
import { appCableChannelKeySelector } from "store/selectors/checkin-app-selectors";

import ActionCable from "./index";

const mapStateToProps = (state) => ({
  channelKey: appCableChannelKeySelector(state),
});

const actions = {
  onReceive: actionCableListener,
};

export default connect(mapStateToProps, actions)(ActionCable);
