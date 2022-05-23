import React, { Component } from "react";
import { connect } from "react-redux";
import { arrayOf, func } from "prop-types";
import cx from "classnames";

import { schedulingSelectedRecallsSelector } from "store/selectors/scheduling-process-selectors";
import {
  setRecallsSelection,
  setCurrentStep,
} from "store/actions/scheduling-process-actions";
import { servicePropType } from "shared/prop-types";
import RecallService from "../RecallService";

class RecallsToSelect extends Component {
  toggleRecall = (recall) => () => {
    const { selectedRecalls, setSelectedRecalls } = this.props;

    setSelectedRecalls(
      this.isRecallSelected(recall)
        ? selectedRecalls.filter((r) => r.name !== recall.name)
        : selectedRecalls.concat(recall),
    );
  };

  isRecallSelected = (service) => this.props.selectedRecalls.filter((item) => item.name === service.name)
    .length > 0;

  render() {
    return (
      <>
        {this.props.availableRecalls.map((recall) => (
          <RecallService
            key={recall.name}
            service={recall}
            onClick={this.toggleRecall(recall)}
            isHighlighted={this.isRecallSelected(recall)}
          />
        ))}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedRecalls: schedulingSelectedRecallsSelector(state),
});

const actions = {
  setSelectedRecalls: setRecallsSelection,
  setSchedulingStep: setCurrentStep,
};

RecallsToSelect.propTypes = {
  availableRecalls: arrayOf(servicePropType).isRequired,
  selectedRecalls: arrayOf(servicePropType),
  setSelectedRecalls: func.isRequired,
};

RecallsToSelect.defaultProps = {
  selectedRecalls: [],
};

export default connect(mapStateToProps, actions)(RecallsToSelect);
