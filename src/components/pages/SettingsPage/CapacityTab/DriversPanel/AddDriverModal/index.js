import React, { useState, useEffect } from "react";
import { string, func } from "prop-types";
import { connect } from "react-redux";
import { isEmpty, isNil } from "ramda";

import { weekDaysHumanFormat, timeInUSFormat } from "shared/utils/datetime";
import { settingsDealershipWorkingHoursSelector, dmsTypeSelector } from "store/selectors/settings-selectors";
import { driverWorkingHoursOptions, extractPhoneNumberFromString } from "shared/utils/common";
import { workingHoursPropType } from "shared/prop-types";
import { phoneNumberLengthValidator } from "shared/validators";
import closeIcon from "assets/images/close.svg";
import ImageInput from "components/common/ImageInput";
import Block from "components/common/Block";
import Input from "components/common/Input";
import StyledSelect from "components/common/StyledSelect";

const AddDriverModal = ({
  dealershipWorkingHours,
  dmsType,
  onSubmit,
  onClose,
  error,
}) => {
  const [driverPhoto, setDriverPhoto] = useState(null);
  const [driverWorkingHours, setDriverWorkingHours] = useState(dealershipWorkingHours);
  const [driverPhoneNumber, setDriverPhoneNumber] = useState("");
  const [driverName, setDriverName] = useState("");
  const [workingHoursOptions, setWorkingHoursOptions] = useState(null);
  const [photoForUpload, setPhotoForUpload] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(error);
  const [showError, setShowError] = useState(false);

  const initializeDriversWorkingHours = () => {
    if (isEmpty(driverWorkingHours)) {
      setDriverWorkingHours(dealershipWorkingHours);
    }
  };

  useEffect(() => {
    setWorkingHoursOptions(driverWorkingHoursOptions(dealershipWorkingHours));
    initializeDriversWorkingHours();
  }, []);

  const validateFromBeforeTo = () => {
    let wrongHoursError = null;
    Object.keys(driverWorkingHours).forEach((dayName) => {
      const fromHourValue = parseInt(driverWorkingHours[dayName].from, 10);
      const toHourValue = parseInt(driverWorkingHours[dayName].to, 10);
      if (driverWorkingHours[dayName].from !== undefined && fromHourValue >= toHourValue) {
        wrongHoursError = "Driver should start the work before the end of it.";
        setErrorMessage(wrongHoursError);
        setShowError(true);
      }
    });

    return isNil(wrongHoursError);
  };

  const validateBothHoursPresent = () => {
    let missingHoursError = null;
    Object.keys(driverWorkingHours).forEach((dayName) => {
      const fromHour = driverWorkingHours[dayName].from;
      const toHour = driverWorkingHours[dayName].to;
      if ((fromHour !== undefined && toHour === undefined)
        || (fromHour === undefined && toHour !== undefined)) {
        missingHoursError = "Driver should have both start and end hours filled or blank.";
        setErrorMessage(missingHoursError);
        setShowError(true);
      }
    });

    return isNil(missingHoursError);
  };

  const validateNamePresent = () => {
    let nameBlankError = null;
    if (isNil(driverName) || isEmpty(driverName)) {
      nameBlankError = "Name should be present";
      setErrorMessage(nameBlankError);
      setShowError(true);
    }

    return isNil(nameBlankError);
  };

  const validatePhoneNumberPresent = () => {
    let phoneNumberBlankError = null;
    if (isNil(driverPhoneNumber) || isEmpty(driverPhoneNumber)) {
      phoneNumberBlankError = "Phone number should be present";
      setErrorMessage(phoneNumberBlankError);
      setShowError(true);
    }

    return isNil(phoneNumberBlankError);
  };

  const validatePhoneNumberFormat = () => {
    let phoneNumberFormatError = null;
    const extractedNumber = extractPhoneNumberFromString(driverPhoneNumber);
    if (!phoneNumberLengthValidator(extractedNumber, dmsType)) {
      phoneNumberFormatError = "Invalid phone number given";
      setErrorMessage(phoneNumberFormatError);
      setShowError(true);
    }

    return isNil(phoneNumberFormatError);
  };

  const submit = () => {
    setErrorMessage(null);
    setShowError(false);
    setShowSuccess(false);
    if (validateFromBeforeTo()
      && validateBothHoursPresent()
      && validateNamePresent()
      && validatePhoneNumberPresent()
      && validatePhoneNumberFormat()) {
      const driverData = new FormData();
      driverData.append("name", driverName);
      driverData.append("phone_number", driverPhoneNumber);
      driverData.append("working_hours", JSON.stringify(driverWorkingHours));
      if (photoForUpload) {
        driverData.append("photo", photoForUpload);
      }
      onSubmit(driverData);
      onClose();
    }
  };

  const handlePhotoChange = (e) => {
    const newPhoto = e.target.files[0];
    const photoUrl = URL.createObjectURL(newPhoto);
    setPhotoForUpload(newPhoto);
    setDriverPhoto({ url: photoUrl });
    setShowError(false);
    setShowSuccess(true);
  };

  return (
    <>
      <div className="capacitySettingsEditDriverModal">
        <div className="capacitySettingsEditDriverModalHeader">
          Add new driver
          <button type="button" className="capacitySettingsEditDriverModalCloseButton" onClick={onClose}>
            <img alt="close" src={closeIcon} />
          </button>
        </div>
        <div className="capacitySettingsEditDriverModalBody">
          <div className="capacitySettingsEditDriverModalStatusContainer">
            {showSuccess && (
              <div className="capacitySettingsEditDriverModalStatusBar capacitySettingsEditDriverModalStatusBarSuccess" onClick={() => setShowSuccess(false)}>
                New photo was successfully uploaded. Don&apos;t forget to save it.
              </div>
            )}
            {showError && (
              <div className="capacitySettingsEditDriverModalStatusBar capacitySettingsEditDriverModalStatusBarError" onClick={() => setShowError(false)}>
                {errorMessage}
              </div>
            )}
          </div>
          <div className="capacitySettingsEditDriverModalSettingsContainer">
            <section className="capacitySettingsEditDriverModalInputsContainer">
              <Input label="Name" value={driverName} onChange={setDriverName} />
              <Input label="Phone number" value={driverPhoneNumber} onChange={setDriverPhoneNumber} />
            </section>
            <section className="capacitySettingsEditDriverModalPhotoAndWorkingHoursContainer">
              <Block
                title="Driver photo"
                className="conciergeBlock conciergeSettingsPageBlock capacitySettingsEditDriverModalPhotoBlock"
              >
                <ImageInput
                  onImageChange={handlePhotoChange}
                  isEditing
                  inputName="driverPhotoInput"
                  image={driverPhoto}
                  alt="concierge driver photo"
                  imagePresentText="Upload Photo"
                  noImageText="No Driver's Photo"
                />
              </Block>
              <section className="conciergeBlock conciergeSettingsPageBlock capacitySettingsEditDriverModalWorkingHoursBlock">
                <section className="conciergeBlockTitle">Working Hours</section>
                <section className="conciergeBlockContent capacitySettingsEditDriverModalWorkingHoursBlockContent">
                  {workingHoursOptions && driverWorkingHours
                    && Object.keys(driverWorkingHours).map((dayName) => (
                      <div className="conciergeDealershipTimeField" key={`${driverName}-${dayName}`}>
                        <div className="conciergeDealershipTimeFieldLabel">
                          {weekDaysHumanFormat(dayName)}
                        </div>
                        <div className="capacitySettingsEditDriverModalHoursBlock">
                          <StyledSelect
                            value={{
                              label: driverWorkingHours[dayName].from
                              && timeInUSFormat(driverWorkingHours[dayName].from),
                              value: driverWorkingHours[dayName].from,
                            }}
                            options={workingHoursOptions[dayName]}
                            className="capacitySettingsEditDriverModalHoursSelect"
                            disabled={isEmpty(workingHoursOptions[dayName])}
                            onChange={({ value }) => setDriverWorkingHours({
                              ...driverWorkingHours,
                              [dayName]: {
                                ...driverWorkingHours[dayName],
                                from: value,
                              },
                            })}
                          />
                          <StyledSelect
                            value={{
                              label: driverWorkingHours[dayName].to
                              && timeInUSFormat(driverWorkingHours[dayName].to),
                              value: driverWorkingHours[dayName].to,
                            }}
                            options={workingHoursOptions[dayName]}
                            className="capacitySettingsEditDriverModalHoursSelect"
                            disabled={isEmpty(workingHoursOptions[dayName])}
                            onChange={({ value }) => setDriverWorkingHours({
                              ...driverWorkingHours,
                              [dayName]: {
                                ...driverWorkingHours[dayName],
                                to: value,
                              },
                            })}
                          />
                        </div>
                      </div>
                    ))}
                </section>
              </section>
            </section>
          </div>
        </div>
        <div className="capacitySettingsEditDriverModalFooter">
          <button type="button" className="capacitySettingsEditDriverModalCancel" onClick={onClose}>Cancel</button>
          <button type="button" className="capacitySettingsEditDriverModalSave" onClick={() => submit()}>Save</button>
        </div>
      </div>
      <button type="button" className="capacitySettingsEditDriverOverlay" />
    </>
  );
};

AddDriverModal.propTypes = {
  onClose: func.isRequired,
  onSubmit: func.isRequired,
  dealershipWorkingHours: workingHoursPropType.isRequired,
  error: string,
  dmsType: string.isRequired,
};

AddDriverModal.defaultProps = {
  error: null,
};

const mapStateToProps = (state) => ({
  dealershipWorkingHours: settingsDealershipWorkingHoursSelector(state),
  dmsType: dmsTypeSelector(state),
});

export default connect(mapStateToProps, null)(AddDriverModal);
