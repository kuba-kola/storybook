import { Component } from "react";
import { func, string } from "prop-types";
import Cable from "actioncable";

class ActionCable extends Component {
  constructor(props) {
    super(props);

    const { authToken } = this.props;

    const actionCableUrl = `${process.env.REACT_APP_CABLE_URL}${authToken ? `?access_token=${authToken}` : ""}`;
    const cable = Cable.createConsumer(actionCableUrl);
    this.state = {
      cable,
      subscription: cable.subscriptions.create({
        channel: this.props.channel,
        channel_key: this.props.channelKey,
      }, {
        received: this.handleReceive,
      }),
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.authToken !== prevProps.authToken) {
      this.initializeConsumer(prevProps);
    } else {
      this.handleSubscriptions(prevProps);
    }
  }

  componentWillUnmount() {
    const { cable, subscription } = this.state;

    if (subscription) {
      cable.subscriptions.remove(subscription);
    }
  }

  handleReceive = (data) => this.props.onReceive(data);

  initializeConsumer(prevProps) {
    const actionCableUrl = `${process.env.REACT_APP_CABLE_URL}?access_token=${this.props.authToken}`;
    const cable = Cable.createConsumer(actionCableUrl);
    this.setState({
      cable,
    }, () => this.handleSubscriptions(prevProps));
  }

  handleSubscriptions(prevProps) {
    const { cable, subscription } = this.state;

    if (this.props.channelKey !== prevProps.channelKey) {
      if (subscription) {
        cable.subscriptions.remove(subscription);
      }
      const newSubscription = cable.subscriptions.create({
        channel: this.props.channel,
        channel_key: this.props.channelKey,
      }, {
        received: this.handleReceive,
      });
      this.setState({ subscription: newSubscription });
    }
  }

  render() { return null; }
}

ActionCable.propTypes = {
  channel: string,
  channelKey: string,
  authToken: string,
  onReceive: func.isRequired,
};

ActionCable.defaultProps = {
  channel: null,
  channelKey: null,
  authToken: null,
};

export default ActionCable;
