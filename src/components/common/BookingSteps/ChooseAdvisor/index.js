import React, { useState, useEffect } from "react";
import Carousel from "nuka-carousel";
import cx from "classnames";
import { arrayOf, number, func } from "prop-types";

import { BOOKING_STEP_TIMESLOT } from "shared/constants";
import { serviceAdvisorPropType } from "shared/prop-types";
import CarouselNavigation from "components/common/CarouselNavigation";
import Button from "components/common/Button";
import AdvisorButton from "./AdvisorButton";

const ChooseAdvisor = ({
  teamServiceAdvisors,
  serviceAdvisors,
  selectedServices,
  setSchedulingStep,
  makeAdvisorSelection,
  fetchTeamAdvisors,
}) => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [advisors, setAdvisors] = useState(teamServiceAdvisors.length ? teamServiceAdvisors : serviceAdvisors);
  const [selectedAdvisor, setSelectedAdvisor] = useState(teamServiceAdvisors[0] || serviceAdvisors[0]);

  useEffect(() => {
    fetchTeamAdvisors();
  }, [selectedServices]);

  useEffect(() => {
    if (!teamServiceAdvisors.length) return;
    setAdvisors(teamServiceAdvisors);
    setSelectedAdvisor(teamServiceAdvisors[0]);
  }, [teamServiceAdvisors]);

  const confirmSelectedAdvisor = () => {
    makeAdvisorSelection(selectedAdvisor);
    setSchedulingStep(BOOKING_STEP_TIMESLOT);
  };

  return (
    <>
      <CarouselNavigation
        carouselIndex={carouselIndex}
        onClickLeft={() => setCarouselIndex(carouselIndex - 1)}
        onClickRight={() => setCarouselIndex(carouselIndex + 1)}
        collectionLength={advisors.length}
        slidesToShow={5}
      />
      <Carousel
        slidesToShow={5}
        swiping={false}
        dragging={false}
        slideIndex={carouselIndex}
        withoutControls
      >
        {advisors
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((serviceAdvisor) => (
            <AdvisorButton
              serviceAdvisor={serviceAdvisor}
              selectedAdvisor={selectedAdvisor}
              onClickHandler={() => setSelectedAdvisor(serviceAdvisor)}
            />
          ))}
      </Carousel>
      <div className="conciergeSchedulingSubmitWrapper">
        <Button
          variant="brand"
          disabled={!selectedAdvisor}
          onClick={confirmSelectedAdvisor}
        >
          Done
        </Button>
      </div>
    </>
  );
};

ChooseAdvisor.propTypes = {
  serviceAdvisors: arrayOf(serviceAdvisorPropType),
  teamServiceAdvisors: arrayOf(serviceAdvisorPropType),
  dealershipId: number.isRequired,
  setSchedulingStep: func.isRequired,
  makeAdvisorSelection: func.isRequired,
};

ChooseAdvisor.defaultProps = {
  teamServiceAdvisors: [],
  serviceAdvisors: [],
};

export default ChooseAdvisor;
