import React from "react";
import { number, func } from "prop-types";
import ArrowButton from "./ArrowButton";
import "./styles.scss";

const CarouselNavigation = ({
  carouselIndex,
  onClickLeft,
  onClickRight,
  collectionLength,
  slidesToShow,
}) => {
  const canSlideLeft = carouselIndex > 0;
  const canSlideRight = (carouselIndex + slidesToShow) < collectionLength;

  return (
    <div className="carouselArrowsContainer">
      <ArrowButton
        isLeft
        disabled={!canSlideLeft}
        onClick={canSlideLeft ? onClickLeft : null}
      />
      <ArrowButton
        isRight
        disabled={!canSlideRight}
        onClick={canSlideRight ? onClickRight : null}
      />
    </div>
  );
};

CarouselNavigation.propTypes = {
  carouselIndex: number.isRequired,
  onClickLeft: func.isRequired,
  onClickRight: func.isRequired,
  collectionLength: number.isRequired,
  slidesToShow: number.isRequired,
};

export default CarouselNavigation;
