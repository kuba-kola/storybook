import React, { useState, useEffect } from "react";
import { string, func, array } from "prop-types";
import { connect } from "react-redux";
import { isEmpty, isNil } from "ramda";
import { weekDaysHumanFormat, leadingZeroHour, timeInUSFormat } from "shared/utils/datetime";
import { settingsDealershipWorkingHoursSelector, settingsTeamTagsSelector } from "store/selectors/settings-selectors";
import { workingHoursPropType, photoPropType } from "shared/prop-types";
import cx from "classnames";
import ImageInput from "components/common/ImageInput";
import Block from "components/common/Block";
import StyledSelect from "components/common/StyledSelect";
import MultiTagSelect from "components/common/MultiTagSelect";
import Modal from "components/common/Modal";

import "./styles.scss";

const EditAdvisorModal = ({
  teamTags,
  advisorTeamTags,
  name,
  employeeNumber,
  photo,
  workingHours,
  availability,
  dealershipWorkingHours,
  onUpdateAdvisorTeamTags,
  onSubmit,
  onClose,
  error,
}) => {
  const [advisorPhoto, setAdvisorPhoto] = useState(photo);
  const [advisorWorkingHours, setAdvisorWorkingHours] = useState(workingHours);
  const [workingHoursOptions, setWorkingHoursOptions] = useState(null);
  const [photoForUpload, setPhotoForUpload] = useState(null);
  const [deletePhoto, setDeletePhoto] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(error);
  const [showError, setShowError] = useState(false);
  const [advisorAvailability, setAdvisorAvailability] = useState(availability);
  const decimalToMinutes = {
    25: "15",
    5: "30",
    75: "45",
  };

  const prepareWorkingHoursOptions = () => {
    const workingHoursCopy = { ...dealershipWorkingHours };
    Object.keys(workingHoursCopy).forEach((dayName) => {
      if (workingHoursCopy[dayName].from === undefined) {
        workingHoursCopy[dayName] = [];
        return;
      }
      let dayHoursOptions = [{ label: "", value: undefined }];
      for (let hour = parseInt(workingHoursCopy[dayName].from, 10);
        hour <= parseInt(workingHoursCopy[dayName].to, 10); hour += 0.25) {
        const minutes = decimalToMinutes[`${hour}`.substring(`${hour}`.indexOf(".") + 1, `${hour}`.length)];
        const hourAndMinutes = Number.isSafeInteger(hour) ? `${hour}:00` : `${Math.floor(hour)}:${minutes}`;
        const value = Number.isSafeInteger(hour) ? `${leadingZeroHour(hour)}:00` : `${leadingZeroHour(Math.floor(hour))}:${minutes}`;
        dayHoursOptions = [...dayHoursOptions, { label: timeInUSFormat(hourAndMinutes), value }];
      }
      workingHoursCopy[dayName] = dayHoursOptions;
    });
    setWorkingHoursOptions(workingHoursCopy);
  };

  const initializeAdvisorsWorkingHours = () => {
    if (isEmpty(advisorWorkingHours)) {
      setAdvisorWorkingHours(dealershipWorkingHours);
    }
  };

  useEffect(() => {
    prepareWorkingHoursOptions();
    initializeAdvisorsWorkingHours();
  }, []);

  const validateFromBeforeTo = () => {
    let wrongHoursError = null;
    Object.keys(advisorWorkingHours).forEach((dayName) => {
      const fromHourValue = parseInt(advisorWorkingHours[dayName].from, 10);
      const toHourValue = parseInt(advisorWorkingHours[dayName].to, 10);
      if (advisorWorkingHours[dayName].from !== undefined && fromHourValue >= toHourValue) {
        wrongHoursError = "Advisor should start the work before the end of it.";
        setErrorMessage(wrongHoursError);
        setShowError(true);
      }
    });

    return isNil(wrongHoursError);
  };

  const validateBothHoursPresent = () => {
    let missingHoursError = null;
    Object.keys(advisorWorkingHours).forEach((dayName) => {
      const fromHour = advisorWorkingHours[dayName].from;
      const toHour = advisorWorkingHours[dayName].to;
      if ((fromHour !== undefined && toHour === undefined)
        || (fromHour === undefined && toHour !== undefined)) {
        missingHoursError = "Advisor should have both start and end hours filled or blank.";
        setErrorMessage(missingHoursError);
        setShowError(true);
      }
    });

    return isNil(missingHoursError);
  };

  const submit = () => {
    setErrorMessage(null);
    setShowError(false);
    setShowSuccess(false);
    if (validateFromBeforeTo() && validateBothHoursPresent()) {
      onSubmit(photoForUpload, deletePhoto, advisorWorkingHours, advisorAvailability);
      onClose();
    }
  };

  const handlePhotoChange = (e) => {
    const newPhoto = e.target.files[0];
    const photoUrl = URL.createObjectURL(newPhoto);
    setPhotoForUpload(newPhoto);
    setAdvisorPhoto({ url: photoUrl });
    setDeletePhoto(false);
    setShowError(false);
    setShowSuccess(true);
  };

  const handlePhotoDelete = () => {
    setAdvisorPhoto(null);
    setPhotoForUpload(null);
    setDeletePhoto(true);
  };

  return (
    <Modal
      title={name}
      subtitle={employeeNumber}
      cancelButtonText="Cancel"
      submitButtonText="Save"
      size="large"
      onCancel={onClose}
      onSubmit={submit}
    >
      <div className="capacitySettingsEditAdvisorModalStatusContainer">
        {showSuccess && (
        <div className="capacitySettingsEditAdvisorModalStatusBar capacitySettingsEditAdvisorModalStatusBarSuccess" onClick={() => setShowSuccess(false)}>
          New photo was successfully uploaded. Don&apos;t forget to save it.
        </div>
        )}
        {showError && (
        <div className="capacitySettingsEditAdvisorModalStatusBar capacitySettingsEditAdvisorModalStatusBarError" onClick={() => setShowError(false)}>
          {errorMessage}
        </div>
        )}
      </div>
      <Block
        className="conciergeSettingsPageBlock capacitySettingsEditAdvisorModalPhotoBlock"
      >
        <ImageInput
          isRounded
          onImageChange={handlePhotoChange}
          isEditing
          inputName="advisorPhotoInput"
          image={advisorPhoto}
          alt="concierge advisor photo"
          noImageText="No Photo"
        />
        <div className="capacitySettingsEditAdvisorModalSeparator">&nbsp;</div>
        <div className="capacitySettingsEditAdvisorModalAvailability">
          <div className="capacitySettingsEditAdvisorModalAvailabilityTitle">Availability</div>
          <div className="capacitySettingsEditAdvisorModalAvailabilityOptions">
            <button
              type="button"
              className={cx("capacitySettingsEditAdvisorModalAvailabilityOption", {
                availabilityOptionActive: advisorAvailability === "unavailable",
              })}
              onClick={() => setAdvisorAvailability("unavailable")}
            >
              Not available
            </button>
            <button
              type="button"
              className={cx("capacitySettingsEditAdvisorModalAvailabilityOption", {
                availabilityOptionActive: advisorAvailability === "publicly_available",
              })}
              onClick={() => setAdvisorAvailability("publicly_available")}
            >
              Public
            </button>
            <button
              type="button"
              className={cx("capacitySettingsEditAdvisorModalAvailabilityOption", {
                availabilityOptionActive: advisorAvailability === "internally_available",
              })}
              onClick={() => setAdvisorAvailability("internally_available")}
            >
              Internal Only
            </button>
          </div>
        </div>
        <div className="capacitySettingsEditAdvisorModalSeparator">&nbsp;</div>
        {advisorTeamTags && (
        <MultiTagSelect
          label="Team tags"
          options={teamTags}
          value={advisorTeamTags}
          onChange={(selected) => {
            onUpdateAdvisorTeamTags(selected.map(({ id }) => id));
          }}
        />
        )}
      </Block>
      <section className="conciergeBlock conciergeSettingsPageBlock capacitySettingsEditAdvisorModalWorkingHoursBlock">
        <section className="conciergeBlockTitle">Working Hours</section>
        <section className="conciergeBlockContent capacitySettingsEditAdvisorModalWorkingHoursBlockContent">
          {workingHoursOptions && advisorWorkingHours
                  && Object.keys(advisorWorkingHours).map((dayName) => (
                    <div className="conciergeDealershipTimeField">
                      <div className="conciergeDealershipTimeFieldLabel">
                        {weekDaysHumanFormat(dayName)}
                      </div>
                      <div className="capacitySettingsEditAdvisorModalHoursBlock">
                        <StyledSelect
                          value={{
                            label: advisorWorkingHours[dayName].from
                            && timeInUSFormat(advisorWorkingHours[dayName].from),
                            value: advisorWorkingHours[dayName].from,
                          }}
                          options={workingHoursOptions[dayName]}
                          className="capacitySettingsEditAdvisorModalHoursSelect"
                          disabled={isEmpty(workingHoursOptions[dayName])}
                          onChange={({ value }) => setAdvisorWorkingHours({
                            ...advisorWorkingHours,
                            [dayName]: {
                              ...advisorWorkingHours[dayName],
                              from: value,
                            },
                          })}
                        />
                        <StyledSelect
                          value={{
                            label: advisorWorkingHours[dayName].to
                            && timeInUSFormat(advisorWorkingHours[dayName].to),
                            value: advisorWorkingHours[dayName].to,
                          }}
                          options={workingHoursOptions[dayName]}
                          className="capacitySettingsEditAdvisorModalHoursSelect"
                          disabled={isEmpty(workingHoursOptions[dayName])}
                          onChange={({ value }) => setAdvisorWorkingHours({
                            ...advisorWorkingHours,
                            [dayName]: {
                              ...advisorWorkingHours[dayName],
                              to: value,
                            },
                          })}
                        />
                      </div>
                    </div>
                  ))}
        </section>
      </section>
    </Modal>
  );
};

EditAdvisorModal.propTypes = {
  teamTags: array,
  advisorTeamTags: array,
  onClose: func.isRequired,
  onSubmit: func.isRequired,
  name: string.isRequired,
  availability: string,
  employeeNumber: string.isRequired,
  photo: photoPropType.isRequired,
  workingHours: workingHoursPropType,
  dealershipWorkingHours: workingHoursPropType.isRequired,
  error: string,

};

EditAdvisorModal.defaultProps = {
  teamTags: [],
  advisorTeamTags: [],
  workingHours: {},
  error: null,
};

const mapStateToProps = (state) => ({
  dealershipWorkingHours: settingsDealershipWorkingHoursSelector(state),
  teamTags: settingsTeamTagsSelector(state),
});

export default connect(mapStateToProps, null)(EditAdvisorModal);
