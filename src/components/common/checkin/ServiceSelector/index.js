import React, { Component, Fragment } from "react";
import {
  func, arrayOf, number, string, shape,
} from "prop-types";
import { connect } from "react-redux";
import cx from "classnames";
import InlineSVG from "react-inlinesvg";

import { availableServicesPropType, servicesPropType } from "shared/prop-types";
import { chatAvailableServicesSelector } from "store/selectors/checkin-chat-selectors";
import { makeFloat } from "shared/utils";

import Button from "components/common/checkin/Button";
import Header from "components/common/checkin/Header";
import PackageItems from "components/common/checkin/PackageItems";
import selectedIcon from "assets/icons/services/service-checked.svg";
import unselectedIcon from "assets/icons/services/service-plus.svg";

import styles from "./styles.module.scss";

const MAINTENANCE_TAB = "MAINTENANCE";

const MAINTENANCE_HEADER = "Maintenance";
const CONCERN_HEADER = "Concern";

class ServiceSelector extends Component {
  closeModal = () => {
    this.setState({ currentTab: null });
    this.props.closeModal();
  };

  isDisabled = (service) => this.props.disabledPackageItems.map((item) => item.id).includes(service.id);

  renderIcon = (className, src) => (
    <div className={className}>
      <InlineSVG src={src} />
    </div>
  );

  renderService = (service, onClick, isSelected, isDisabled) => {
    isDisabled && console.log(service, "disabled");
    const {
      package_items, name, extras, fee, saving,
    } = service;
    return (
      <button
        key={service.id}
        className={cx(styles.service, {
          [styles.highlighted]: isSelected,
          [styles.disabled]: isDisabled,
        })}
        onClick={onClick(service)}
        disabled={isDisabled}
      >
        <div className={styles.serviceBody}>
          <span className={styles.serviceName}>{name}</span>
          {isSelected
            ? this.renderIcon(styles.selectedIcon, selectedIcon)
            : this.renderIcon(styles.unselectedIcon, unselectedIcon)}
          <div className={styles.servicePriceWrap}>
            <div className={styles.servicePriceTag}>
              $
              {makeFloat(fee || 0)}
            </div>
            {package_items.length > 0 && saving > 0 && (
              <div className={styles.serviceSaveTag}>
                Save $
                {makeFloat(saving)}
              </div>
            )}
          </div>
        </div>

        {package_items.length > 0 && <PackageItems items={package_items} extras={extras} isSelected={isSelected} />}
      </button>
    );
  };

  renderSelector = (header, services, selectedServices, toggleService) => (
    <>
      <Header title={header} onClose={this.closeModal} />
      <div className={styles.servicesContainer}>
        {services.map((service) => this.renderService(
          service,
          toggleService,
          !!selectedServices.find(({ id }) => id === service.id),
          this.isDisabled(service),
        ))}
      </div>
      <div className={styles.chatInput}>
        <Button
          caption="Save"
          onClick={() => this.props.addServices()}
          isWide
          disabled={selectedServices.length === 0}
        />
      </div>
    </>
  );

  renderServices = () => {
    const {
      availableServices,
      selectedMaintenance,
      selectedConcern,
      toggleMaintenance,
      toggleConcern,
      serviceKind,
    } = this.props;
    const { maintenance, concern } = availableServices;

    return serviceKind === MAINTENANCE_TAB
      ? this.renderSelector(MAINTENANCE_HEADER, maintenance, selectedMaintenance, toggleMaintenance)
      : this.renderSelector(CONCERN_HEADER, concern, selectedConcern, toggleConcern);
  };

  render() {
    return this.renderServices();
  }
}

ServiceSelector.propTypes = {
  availableServices: availableServicesPropType.isRequired,
  selectedMaintenance: servicesPropType.isRequired,
  selectedConcern: servicesPropType.isRequired,
  toggleMaintenance: func.isRequired,
  toggleConcern: func.isRequired,
  addServices: func.isRequired,
  closeModal: func.isRequired,
  serviceKind: string,
  disabledPackageItems: arrayOf(shape({ id: number, name: string })),
};

ServiceSelector.defaultProps = {
  disabledPackageItems: [],
};

const mapStateToProps = (state) => ({
  availableServices: chatAvailableServicesSelector(state),
});

const ServiceSelectorContainer = connect(mapStateToProps)(ServiceSelector);

export default ServiceSelectorContainer;
