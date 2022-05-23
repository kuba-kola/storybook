import React from "react";
import {
  object, shape, number, string, oneOfType, instanceOf, func,
} from "prop-types";
import Button from "components/common/Button";
import { isAllowedToUpdate } from "components/pages/BookingDetailsPage/RemotePanel/utils";

const UpdateButton = ({
  jobFind,
  job,
  updateDriverJobHandle,
}) => {
  const getAddressDataFromJob = ({
    address_line1,
    address_line2,
    address_city,
    address_state,
    address_zipcode,
  }) => ({
    address_line1,
    address_line2,
    address_city,
    address_state,
    address_zipcode,
  });

  const addressDataJobFind = getAddressDataFromJob(jobFind);

  const getValidAddressData = () => {
    if (job.date && job.time && job.driver && job.address && jobFind) {
      if (job.addressData && Object.values(job.addressData).filter((v) => !v).length === 0) {
        return job.addressData;
      } if (jobFind.address && addressDataJobFind && Object.values(addressDataJobFind).filter((v) => !v).length === 0
      ) {
        return addressDataJobFind;
      }
    }
    return null;
  };

  return (
    <>
      {(jobFind.aasm_state && isAllowedToUpdate(jobFind.aasm_state)) ? (
        <Button
          className="conciergeButtonApply AdditionalInfo"
          onClick={() => {
            const dropOffDriverId = job.driver ? job.driver.id : null;
            const dropOffCoDriverId = job.coDriver ? job.coDriver.id : null;

            updateDriverJobHandle(getValidAddressData(), { date: job.date, time: job.time },
              dropOffDriverId, dropOffCoDriverId, job.notes, jobFind.id);
          }}
          disabled={!getValidAddressData()}
        >
          Update
        </Button>
      ) : null}
    </>
  );
};

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
