import React, { Fragment, Component } from "react";
import { bool, number, obj } from "prop-types";
import { connect } from "react-redux";

import { DELAY_500 } from "shared/constants/delays";
import { chatHistoryPropType } from "shared/prop-types";
import scrollIntoViewSmoothly from "shared/utils/smoothScrollIntoView";
import {
  chatHistorySelector,
  chatLoadingSelector,
  chatLoadingStateDelaySelector,
  chatIsInitializedSelector,
} from "store/selectors/checkin-chat-selectors";
import LoadingState from "components/common/LoadingState";
import InputBar from "components/common/InputBar";

import styles from "./styles.module.scss";

class ChatPage extends Component {
  componentDidUpdate() {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    if (this.messagesEnd) {
      this.scrollTimeout = setTimeout(() => {
        scrollIntoViewSmoothly(this.messagesEnd, { behavior: "smooth", block: "end" });
        // window.scroll(0, document.getElementById("customer_pages_root").scrollHeight);
      }, 50);
    }
  };

  render() {
    if (!this.props.isInitialized) {
      return null;
    }
    return (
      <>
        <div className={styles.container}>
          {this.props.history.map(({ component, props, id }) => {
            const ChatComponent = component;
            return <ChatComponent key={id} {...props} />;
          })}
          {this.props.isLoading && (
            <LoadingState delay={this.props.loadingStateDelay} />
          )}
          <div
            className={styles.lastMessage}
            ref={(el) => {
              this.messagesEnd = el;
            }}
          />
        </div>
        <InputBar />
      </>
    );
  }
}

ChatPage.propTypes = {
  isInitialized: bool,
  history: chatHistoryPropType.isRequired || obj,
  isLoading: bool,
  loadingStateDelay: number,
};

ChatPage.defaultProps = {
  isInitialized: false,
  isLoading: false,
  loadingStateDelay: DELAY_500,
};

const mapStateToProps = (state) => ({
  isInitialized: chatIsInitializedSelector(state),
  history: chatHistorySelector(state),
  isLoading: chatLoadingSelector(state),
  loadingStateDelay: chatLoadingStateDelaySelector(state),
});

const ChatPageContainer = connect(mapStateToProps)(ChatPage);

export default ChatPageContainer;
