import React, { useState } from "react";
import { arrayOf, string } from "prop-types";
import "./styles.scss";
import down from "assets/images/down.svg";
import up from "assets/images/up.svg";

const PackageItems = ({ packageItems, extras }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (

    <div className="PackageItems">
      <div
        className="PackageItemsTitle"
        onClick={() => setIsOpen(!isOpen)}
      >
        See operations included
        <img className="PackageItemsTitleIcon" src={isOpen ? up : down} alt="" />
      </div>
      {isOpen && (
        <div className="PackageItemsList">
          {[...packageItems, ...extras].map((item) => (
            <span
              key={item.name || item}
              className="PackageItemsListItem"
            >
              {item.name || item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

PackageItems.propTypes = {
  packageItems: arrayOf({
    name: string,
  }).isRequired,
  extras: arrayOf(string),
};

PackageItems.defaultProps = {
  extras: [],
};

export default PackageItems;
