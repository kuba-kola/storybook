import React, { Component } from "react";
import PropTypes from "prop-types";
import { decisionTreePropType } from "shared/prop-types";
import { isEmpty, last, transpose } from "ramda";
import Block from "components/common/Block";

import downIcon from "assets/images/down.svg";
import upIcon from "assets/images/up.svg";
import serviceIconsMap from "shared/serviceIconsMap";

import "../styles.scss";

class SelectedServices extends Component {
  constructor(props) {
    super(props);
    this.state = { openItemIndex: null };
  }

  getNoInfoBlock = () => (
    <Block>
      No services specified
    </Block>
  )

  setOpenItem = (index) => this.setState(({ openItemIndex }) => ({
    openItemIndex: openItemIndex === index ? null : index,
  }))

  getAccordionWithData = () => {
    const { menu_items, decision_tree_results } = this.props.booking;
    const { openItemIndex } = this.state;
    return (
      <>
        {(menu_items || []).map((menuItem, index) => {
          const isCurrentlySelected = openItemIndex === index;
          const correspondingDecisionTree = last((decision_tree_results || [])
            .filter((tree) => tree.menu_item_id === menuItem.menu_item_id)) || {};
          const answerIndexes = (
            correspondingDecisionTree.details || [])
            .map((treeItem, treeItemIndex) => (treeItem.source === "SOURCE_USER" ? treeItemIndex : null))
            .filter((treeItem) => treeItem !== null);
          const questionIndexes = answerIndexes.map((answerIndex) => answerIndex - 1);
          const dialog = transpose([questionIndexes, answerIndexes]);
          return (
            <section key={menuItem.id}>
              <div className="bookingDetailsSection">
                <div className="bookingDetailsService">
                  <img
                    src={
                      serviceIconsMap[menuItem.kind]
                      || (menuItem.operation_code && serviceIconsMap.recall)
                    }
                    className="appointmentDetailsServiceIcon"
                    alt=""
                  />
                </div>
                <div className="bookingDetailsService">
                  <span className="bookingDetailsServiceName">{menuItem.name}</span>
                  <div className="bookingDetailsServicePrice">
                    <span className="bookingDetailsServicePriceSmallGrayText">Price:</span>
                    <span className="bookingDetailsServicePriceValue">{`$${menuItem.price}`}</span>
                  </div>
                </div>
                <div className="bookingDetailsService bookingDetailsServiceToggle">
                  <img
                    className="conciergeBookedServiceAccordionItemToggleButton"
                    src={isCurrentlySelected ? upIcon : downIcon}
                    alt="concierge toggle"
                    onClick={() => this.setOpenItem(index)}
                  />
                </div>
              </div>
              {isCurrentlySelected
                ? (
                  <section className="bookingDetailsServiceAccordionItemContent">
                    {isEmpty(dialog)
                      ? <p>No information</p>
                      : dialog.map((indexPair, dialogIndex) => (
                        <section className="bookingDetailsServiceAccordionItemQuestionBlock" key={indexPair[0]}>
                          <span className="bookingDetailsServiceAccordionItemQuestionBlockLabel">
                            {dialogIndex + 1}
                            {". "}
                          </span>
                          <span className="bookingDetailsServiceAccordionItemQuestionBlockValue">
                            {`${correspondingDecisionTree.details[indexPair[0]].text} /`}
                          </span>
                          <span className="bookingDetailsServiceAccordionItemQuestionBlockAnswer">
                            {correspondingDecisionTree.details[indexPair[1]].text}
                          </span>
                        </section>
                      ))}
                    {
                      menuItem.additional_note
                        ? (
                          <section className="bookingDetailsServiceAccordionItemQuestionBlock">
                            <span className="bookingDetailsServiceAccordionItemQuestionBlockValue">
                              Customer States
                            </span>
                            <span className="bookingDetailsServiceAccordionItemQuestionBlockAnswer">
                              {menuItem.additional_note}
                            </span>
                          </section>
                        )
                        : null
                    }
                  </section>
                )
                : null}
            </section>
          );
        })}
      </>
    );
  }

  render() {
    const { menu_items } = this.props.booking;

    return (
      <section>
        {
          isEmpty(menu_items)
            ? this.getNoInfoBlock()
            : this.getAccordionWithData()
        }
      </section>
    );
  }
}

SelectedServices.propTypes = {
  booking: PropTypes.shape({
    menu_items: PropTypes.arrayOf(PropTypes.number).isRequired,
    decision_tree_results: decisionTreePropType,
  }).isRequired,
};

export default SelectedServices;
