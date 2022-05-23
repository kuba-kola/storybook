import React, { Component, Fragment } from "react";
import {
  func, arrayOf, shape, number, string, object,
} from "prop-types";
import { connect } from "react-redux";
import cx from "classnames";

import { DELAY_1000, DELAY_2000 } from "shared/constants/delays";
import { remove } from "shared/utils";
import {
  editBooking,
  undoEditBooking,
  confirmBooking,
  addServices,
  closeServiceSelector,
} from "store/actions/checkin-chat-actions";
import { allServicesSelector } from "store/selectors/checkin-chat-selectors";

import Button from "components/common/checkin/Button";
import AnimationGroup from "components/common/checkin/AnimationGroup";
import Animation from "components/common/checkin/Animation";
import ServiceSelector from "components/common/checkin/ServiceSelector";

import styles from "./styles.module.scss";

class BookingConfirmationStepInput extends Component {
  state = {
    newMaintenance: [],
    newConcern: [],
    isEditing: !!this.props.isEditing,
    isModalOpen: false,
    isComplete: false,
    disabledPackageItems: [],
  };

  componentWillUnmount() {
    this.cancelEditing();
  }

  openModal = () => this.setState({ isModalOpen: true });

  cancelEditing = () => {
    this.setState({ isEditing: false });
    this.props.undoEditBooking();
  };

  confirmBooking = () => {
    this.setState({ isEditing: false, isComplete: true });
    if (this.props.onEditSave) {
      this.props.undoEditBooking();
      this.props.onEditSave();
    } else {
      this.props.onConfirm();
    }
  };

  closeModal = () => {
    this.props.closeServiceSelector();
    this.setState({
      isModalOpen: false,
      newMaintenance: [],
      newConcern: [],
    });
  };

  includesService = (collection, service) => collection.map((item) => item.id).includes(service.id);

  toggleMaintenance = (service) => () => {
    const { newMaintenance, disabledPackageItems } = this.state;
    const packageItems = service.package_items;

    if (newMaintenance.find(({ id }) => id === service.id)) {
      this.setState({
        newMaintenance: newMaintenance.filter(({ id }) => id !== service.id),
        disabledPackageItems: remove(disabledPackageItems, packageItems),
      });
    } else {
      this.setState({
        // eslint-disable-next-line max-len
        newMaintenance: newMaintenance.filter((s) => !this.includesService(packageItems, s)).concat(service),
        disabledPackageItems: (disabledPackageItems || []).concat(packageItems),
      });
    }
  };

  toggleConcern = (service) => () => {
    const { newConcern, disabledPackageItems } = this.state;
    const packageItems = service.package_items;

    if (newConcern.find(({ id }) => id === service.id)) {
      this.setState({
        newConcern: newConcern.filter(({ id }) => id !== service.id),
        disabledPackageItems: remove(disabledPackageItems, packageItems),
      });
    } else {
      this.setState({
        newConcern: newConcern.filter((s) => !this.includesService(packageItems, s)).concat(service),
        disabledPackageItems: (disabledPackageItems || []).concat(packageItems),
      });
    }
  };

  changeDetails = () => {
    this.props.editBooking();
    this.setState({ isEditing: true });
  };

  addServices = () => {
    this.props.addServices({
      maintenance: this.state.newMaintenance,
      concern: this.state.newConcern,
    });
    this.closeModal();
  };

  renderModal = (serviceKind) => {
    const { newMaintenance, newConcern, disabledPackageItems } = this.state;

    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <ServiceSelector
            selectedMaintenance={newMaintenance}
            selectedConcern={newConcern}
            disabledPackageItems={disabledPackageItems}
            toggleMaintenance={this.toggleMaintenance}
            toggleConcern={this.toggleConcern}
            addServices={this.addServices}
            closeModal={this.closeModal}
            serviceKind={serviceKind}
          />
        </div>
      </div>
    );
  };

  render() {
    const { isEditing, isComplete } = this.state;
    const { selectedServices, serviceKind } = this.props;

    if (isComplete) {
      return null;
    }
    if (serviceKind) {
      return this.renderModal(serviceKind);
    }

    return (
      <div className={styles.chatInput} onClick={this.openModal}>
        {isEditing ? (
          <>
            <Button
              className={cx({
                [styles.disabled]: !selectedServices.length,
              })}
              caption="Back"
              disabled={!selectedServices.length}
              onClick={this.cancelEditing}
              isSecondary
              isWide
            />
            <Button
              className={cx(styles.confirm, {
                [styles.disabled]: !selectedServices.length,
              })}
              caption="Confirm"
              onClick={this.confirmBooking}
              disabled={!selectedServices.length}
              isWide
            />
          </>
        ) : (
          <>
            <Button delay={DELAY_1000} isSecondary caption="Change details" onClick={this.changeDetails} isWide />
            <Button className={styles.confirm} caption="Confirm" onClick={this.confirmBooking} isWide />
          </>
        )}
      </div>
    );
  }
}

BookingConfirmationStepInput.propTypes = {
  onConfirm: func.isRequired,
  editBooking: func.isRequired,
  addServices: func.isRequired,
  closeServiceSelector: func.isRequired,

  selectedServices: arrayOf(
    shape({
      id: number,
      name: string,
      package_items: arrayOf(shape({ id: number, name: string })),
    }),
  ).isRequired,
  transcription: string,
  classification: object, // eslint-disable-line react/forbid-prop-types
  modelName: string,
  serviceKind: string,
  onEditSave: func,
};

BookingConfirmationStepInput.defaultProps = {
  transcription: "",
  classification: null,
  modelName: "",
};

const mapStateToProps = (state) => ({
  selectedServices: allServicesSelector(state),
});

const actions = {
  editBooking,
  addServices,
  onConfirm: confirmBooking,
  undoEditBooking,
  closeServiceSelector,
};

const BookingConfirmationStepInputContainer = connect(mapStateToProps, actions)(BookingConfirmationStepInput);

/* eslint-disable react/prop-types */
const AnimationWrapper = (props) => (
  <AnimationGroup>
    <Animation delay={props.delayed ? DELAY_2000 : DELAY_1000}>
      <BookingConfirmationStepInputContainer {...props} />
    </Animation>
  </AnimationGroup>
);
/* eslint-enable react/prop-types */

export default AnimationWrapper;
