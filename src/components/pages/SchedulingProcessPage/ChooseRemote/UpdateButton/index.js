import React from "react";
import {
  object, shape, number, string, oneOfType, instanceOf, func,
} from "prop-types";
import Button from "components/common/Button";
import { convertDateToISO, isAllowedToUpdate } from "components/pages/BookingDetailsPage/RemotePanel/utils";

const UpdateButton = ({
  jobFind,
  job,
  updateDriverJobHandle,
}) => (
  <>
    {(jobFind.aasm_state && isAllowedToUpdate(jobFind.aasm_state)) ? (
      <Button
        className="conciergeButtonApply AdditionalInfo"
        onClick={() => {
          if (job.location && job.date && job.time
                && job.driver) {
            const dropOffCollectionTime = convertDateToISO(job.date, job.time);
            const dropOffDriverId = job.driver ? job.driver.id : null;
            const dropOffCoDriverId = job.coDriver ? job.coDriver.id : null;

            updateDriverJobHandle(job.location, dropOffCollectionTime,
              dropOffDriverId, dropOffCoDriverId, job.notes, jobFind.id);
          }
        }}
        disabled={(!job.location || !job.date || !job.time
                || !job.driver || jobFind.length)}
      >
        Update
      </Button>
    ) : null}
  </>
);

UpdateButton.propTypes = {
  jobFind: shape({
    aasm_state: string,
    id: number,
  }),
  job: shape({
    coDriver: oneOfType([object, string]),
    date: oneOfType([string, instanceOf(Date)]),
    driver: oneOfType([object, string]),
    location: string,
    notes: string,
    time: string,
  }),
  updateDriverJobHandle: func.isRequired,
};

UpdateButton.defaultProps = {
  jobFind: {},
  job: {},
};

export default UpdateButton;
