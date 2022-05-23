import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { func, arrayOf, bool } from 'prop-types';

import {
  schedulingAvailableRecallsSelector,
  schedulingSelectedRecallsSelector,
  schedulingRecallsLoadingSelector,
  schedulingRecallsLoadingErrorSelector,
} from 'store/selectors/scheduling-process-selectors';
import { setCurrentStep, fetchRecalls } from 'store/actions/booking-details-actions';
import { servicePropType } from 'shared/prop-types';
import { BOOKING_STEP_ADVISOR } from 'shared/constants';

import Panel from 'components/common/Panel';
import RecallsToSelect from './RecallsToSelect';
import './styles.scss';

const ChooseRecalls = ({
  availableRecalls,
  retrieveDealershipRecalls,
  selectedRecalls,
  setSchedulingStep,
  recallsLoading,
  recallsLoadingError,
}) => {
  useEffect(() => {
    retrieveDealershipRecalls();
  }, []);
  if (recallsLoading) {
    return <Panel className="conciergeSchedulingLoadingPanel">Loading...</Panel>;
  }

  return (
    <section className="chooseServicesContainer">
      {recallsLoadingError ? (
        <Panel className="conciergeSchedulingLoadingPanel">Please try again.</Panel>
      ) : (
        <>
          <RecallsToSelect availableRecalls={availableRecalls} selectedRecalls={selectedRecalls} />
          <div className="conciergeSchedulingSubmitWrapper">
            <button
              type="button"
              className="conciergeSchedulingButton conciergeSchedulingSubmitButton"
              onClick={() => setSchedulingStep(BOOKING_STEP_ADVISOR)}
            >
              Done
            </button>
          </div>
        </>
      )}
    </section>
  );
};

const mapStateToProps = (state) => ({
  availableRecalls: schedulingAvailableRecallsSelector(state),
  selectedRecalls: schedulingSelectedRecallsSelector(state),
  recallsLoading: schedulingRecallsLoadingSelector(state),
  recallsLoadingError: schedulingRecallsLoadingErrorSelector(state),
});

const actions = {
  setSchedulingStep: setCurrentStep,
  retrieveDealershipRecalls: fetchRecalls,
};

ChooseRecalls.propTypes = {
  availableRecalls: arrayOf(servicePropType),
  selectedRecalls: arrayOf(servicePropType),
  setSchedulingStep: func.isRequired,
  retrieveDealershipRecalls: func.isRequired,
  recallsLoading: bool.isRequired,
  recallsLoadingError: bool.isRequired,
};

ChooseRecalls.defaultProps = {
  availableRecalls: [],
  selectedRecalls: [],
};

export default connect(mapStateToProps, actions)(ChooseRecalls);
