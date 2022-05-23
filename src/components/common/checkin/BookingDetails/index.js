import React from "react";
import { string, bool, func } from "prop-types";
import { connect } from "react-redux";
import cx from "classnames";

import { makeFloat } from "shared/utils";
import { bookingPropType } from "shared/prop-types";
import { chatBookingSelector } from "store/selectors/checkin-chat-selectors";
import { appDealershipTaxRateSelector } from "store/selectors/checkin-app-selectors";
import { removeService, removeLineItem, openServiceSelector } from "store/actions/checkin-chat-actions";

import PackageItems from "components/common/checkin/PackageItems";

import removeIcon from "assets/icons/services/service-minus.svg";
import addIcon from "assets/icons/services/service-plus.svg";

import styles from "./styles.module.scss";

const MAINTENANCE_TAB = "MAINTENANCE";
const CONCERN_TAB = "CONCERN";

const serviceRemovable = (services, lineItems) => {
  const removableServices = [services.maintenance, services.concern, services.extensions];
  return [...Object.values(removableServices), ...lineItems].length > 1;
};

const containsPackage = (services) => services.maintenance.concat(services.concern).some((s) => s.package_items.length !== 0);

const BookingDetails = ({
  booking: {
    isPickupJobCheckin,
    jobDate,
    jobLocation,
    vehicle,
    services,
    date,
    customer,
    advisor,
    totalPrice,
    totalTime,
    totalPriceBeforeDiscount,
    discount,
    lineItems,
  },
  isEditing,
  remove,
  removeItem,
  taxRate,
  openServiceSelector,
}) => {
  const filteredBookingMenuItems = services.bookingsMenuItems.filter((bmi) => !services.recalls.find((recall) => recall.id === bmi.recall_id));
  return (
    <div className={cx(styles.box, styles.details)}>
      <div className={cx(styles.box__header, styles.header)}>
        {isPickupJobCheckin ? "Pickup" : "Reservation"}
        {" "}
        details
      </div>
      <div className={cx(styles.box__body, styles.info)}>
        <span className={styles.vehicle}>{vehicle}</span>
        {isPickupJobCheckin ? (
          <>
            <span className={styles.infotag}>Collection time</span>
            <span className={styles.date}>{jobDate}</span>
            <span className={styles.infotag}>Location</span>
            <span className={styles.date}>{jobLocation}</span>
          </>
        ) : (
          <span className={styles.date}>{date}</span>
        )}
      </div>
      {advisor && (
        <div className={cx(styles.advisor)}>
          {advisor.photo && <img src={advisor.photo} className={styles.advisor__img} alt="" />}
          <div className={styles.advisor__info}>
            <div className={styles.advisor__caption}>Your service consultant</div>
            <div className={styles.advisor__name}>{advisor.name}</div>
          </div>
        </div>
      )}
      <div className={cx(styles.box__body, styles.box__box_nopad)} />
      {isEditing && (
        <div className={cx(styles.box__header, styles.header)} onClick={() => openServiceSelector(MAINTENANCE_TAB)}>
          <span>Add a Maintenance.</span>
          <button className={styles.addservice}>
            <img src={addIcon} alt="add service" />
          </button>
        </div>
      )}

      <div className={cx(styles.box__body, styles.box__box_nopad)} />
      {isEditing && (
        <div className={cx(styles.box__header, styles.header)} onClick={() => openServiceSelector(CONCERN_TAB)}>
          <span>Add a Concern.</span>
          <button className={styles.addservice}>
            <img src={addIcon} alt="add service" />
          </button>
        </div>
      )}
      <div className={cx(styles.box__header, styles.header)}>Services</div>
      <div className={cx(styles.box__body, styles.box__box_nopad)}>

        {[...services.maintenance, ...services.concern, ...filteredBookingMenuItems].map((service) => {
          const {
            id, name, fee, saving, package_items = [], extras, price,
          } = service;
          return (
            <div key={id} className={styles.service}>
              <div className={styles.service__wrap}>
                {isEditing && serviceRemovable(services, lineItems) && (
                  <button className={styles.remove} onClick={() => remove(id)}>
                    <img alt="remove service" src={removeIcon} />
                  </button>
                )}
                <div className={styles.service__body}>
                  {package_items.length > 0 && saving > 0 && (
                    <div className={styles.service__row}>
                      <div className={styles.service__savetag}>
                        {" "}
                        Save $
                        {saving}
                      </div>
                    </div>
                  )}
                  <div className={styles.service__row}>
                    <span className={styles.service__name}>{name}</span>
                    <div className={styles.priceContainer}>
                      {package_items.length > 0 && (
                        <span className={styles.packageItemsPrice}>
                          $
                          {makeFloat(fee + saving)}
                        </span>
                      )}
                      <span className={styles.price}>
                        $
                        {makeFloat(fee || price || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {package_items.length > 0 && <PackageItems items={package_items} extras={extras} />}
            </div>
          );
        })}

        {[...services.extensions, ...services.recalls, ...lineItems].map(({ id, name, fee }) => (
          <div key={id} className={styles.service}>
            <div className={styles.service__wrap}>
              {isEditing && serviceRemovable(services, lineItems) && (
                <button className={styles.remove} onClick={() => removeItem(id)}>
                  <img alt="remove service" src={removeIcon} />
                </button>
              )}
              <div className={styles.service__body}>
                <div className={styles.service__row}>
                  <span className={styles.service__name}>{name}</span>
                  <div className={styles.priceContainer}>
                    <span className={styles.price}>
                      $
                      {makeFloat(fee || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={cx(styles.box__header, styles.header)}>Total</div>
      <div className={styles.box__body}>
        <div className={styles.totalPriceContainer}>
          {containsPackage(services) && totalPriceBeforeDiscount > 0 && (
            <span className={cx(styles.totalValue, styles.totalPackageItemsValue)}>
              $
              {makeFloat(totalPriceBeforeDiscount)}
            </span>
          )}
          <span className={styles.totalValue}>
            $
            {makeFloat(totalPrice)}
          </span>
        </div>
        {containsPackage(services) && (
          <div className={styles.data}>
            <span className={styles.dataLabel}>With package you save: </span>
            <span className={cx(styles.discount, styles.dataValue)}>
              {discount}
              %
            </span>
          </div>
        )}
        <div className={styles.data}>
          <span className={styles.dataLabel}>Tax Rate: </span>
          <span className={styles.dataValue}>
            {taxRate}
            %
          </span>
        </div>
      </div>
    </div>
  );
};

BookingDetails.propTypes = {
  isEditing: bool,
  remove: func.isRequired,
  removeItem: func.isRequired,
  openServiceSelector: func.isRequired,
  booking: bookingPropType.isRequired,
  taxRate: string.isRequired,
};

BookingDetails.defaultProps = {
  isEditing: false,
};

const mapStateToProps = (state) => ({
  booking: chatBookingSelector(state),
  taxRate: appDealershipTaxRateSelector(state),
});

const actions = {
  remove: removeService,
  removeItem: removeLineItem,
  openServiceSelector,
};

export default connect(mapStateToProps, actions)(BookingDetails);
