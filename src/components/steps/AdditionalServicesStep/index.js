import React, { Fragment } from "react";
import { connect } from "react-redux";
import { func, bool } from "prop-types";

import {
  chatAdditionalServicesSelector,
  chatSelectedExtensionsSelector,
  chatCurrentVehicleSelector,
} from "store/selectors/checkin-chat-selectors";
import { DELAY_1000, DELAY_1500, DELAY_2000 } from "shared/constants/delays";
import { servicesPropType, vehiclePropType } from "shared/prop-types";
import { toggleExtension } from "store/actions/checkin-chat-actions";
import { SOURCE_CONCIERGE, SOURCE_USER } from "shared/constants/text-messages";
import ExtensionService from "components/common/checkin/ExtensionService";
import AnimationGroup from "components/common/checkin/AnimationGroup";
import Animation from "components/common/checkin/Animation";
import AnimatedTextMessage from "components/common/checkin/AnimatedTextMessage";

import styles from "./styles.module.scss";

const MAX_VISIBLE_EXTENSIONS = 3;

const AdditionalServicesStep = ({
  isComplete, currentVehicle, onToggle, additionalServices, selectedServices,
}) => (
  <>
    <AnimationGroup>
      <AnimatedTextMessage
        delay={DELAY_1000}
        message={`I can recommend some additional services based on what other ${currentVehicle.model} owners choose for their cars:`}
        source={SOURCE_CONCIERGE}
        isOpening
      />
      <AnimatedTextMessage delay={DELAY_1500} message="Feel free to add them to booking!" source={SOURCE_CONCIERGE} />
      <Animation delay={DELAY_2000}>
        <div className={styles.services}>
          {additionalServices.slice(0, MAX_VISIBLE_EXTENSIONS).map((service) => (
            <ExtensionService
              key={service.id}
              service={service}
              onClick={isComplete ? () => null : () => onToggle(service)}
              isHighlighted={!!selectedServices.find(({ id }) => service.id === id)}
            />
          ))}
        </div>
      </Animation>
    </AnimationGroup>
    {isComplete && (
      <AnimationGroup>
        <AnimatedTextMessage
          message={
            selectedServices.length
              ? `Let's add this to the list: ${selectedServices.map((s) => s.name).join(", ")}`
              : "No, thank you."
          }
          source={SOURCE_USER}
        />
      </AnimationGroup>
    )}
  </>
);

AdditionalServicesStep.propTypes = {
  isComplete: bool,
  currentVehicle: vehiclePropType.isRequired,
  additionalServices: servicesPropType.isRequired,
  selectedServices: servicesPropType,
  onToggle: func.isRequired,
};

AdditionalServicesStep.defaultProps = {
  isComplete: false,
  selectedServices: [],
};

const mapStateToProps = (state) => ({
  currentVehicle: chatCurrentVehicleSelector(state),
  additionalServices: chatAdditionalServicesSelector(state),
  selectedServices: chatSelectedExtensionsSelector(state),
});

const actions = {
  onToggle: toggleExtension,
};

const AdditionalServicesStepContainer = connect(mapStateToProps, actions)(AdditionalServicesStep);

export default AdditionalServicesStepContainer;
