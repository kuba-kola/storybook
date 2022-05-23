import React, { Component } from "react";
import { object } from "prop-types";
import { isEmpty, last, transpose } from "ramda";
import cx from "classnames";
import Block from "components/common/Block";

import downIcon from "assets/images/down.svg";
import upIcon from "assets/images/up.svg";

import "./styles.scss";

class BookedServicesBlock extends Component {
  constructor(props) {
    super(props);
    this.state = { openItemIndex: null };
  }

  getNoInfoBlock = () => (
    <Block>
      Current booking do not contain information about booked services
    </Block>
  )

  setOpenItem = (index) => this.setState(({ openItemIndex }) => ({
    openItemIndex: openItemIndex === index ? null : index,
  }))

  getAccordionWithData = () => {
    const { menu_items, decision_tree_results } = this.props.booking;
    const { openItemIndex } = this.state;
    return (
      <section className="conciergeBookedServicesAccordion">
        {(menu_items || []).map((menuItem, index) => {
          const isCurrentlySelected = openItemIndex === index;
          const accordionItemClasses = cx("conciergeBookedServicesAccordionItem", {
            "conciergeBookedServicesAccordionItem-open": isCurrentlySelected,
          });
          const correspondingDecisionTree = last((decision_tree_results || [])
            .filter((tree) => tree.menu_item_id === menuItem.menu_item_id)) || {};
          const answerIndexes = (
            correspondingDecisionTree.details || [])
            .map((treeItem, treeItemIndex) => (treeItem.source === "SOURCE_USER" ? treeItemIndex : null))
            .filter((treeItem) => treeItem !== null);
          const questionIndexes = answerIndexes.map((answerIndex) => answerIndex - 1);
          const dialog = transpose([questionIndexes, answerIndexes]);
          return (
            <section className={accordionItemClasses} key={menuItem.id}>
              <section
                className="conciergeBookedServicesAccordionItemHeader"
              >
                <section className="conciergeBookedServicesAccordionItemHeaderRow">
                  <p className="conciergeBookedServicesMenuItemTitle">
                    {menuItem.kind}
                    {" "}
                    {menuItem.name}
                  </p>
                  <img
                    className="conciergeBookedServicesAccordionItemToggleButton"
                    src={isCurrentlySelected ? upIcon : downIcon}
                    alt="concierge toggle"
                    onClick={() => this.setOpenItem(index)}
                  />
                </section>
                <section className="conciergeBookedServicesAccordionItemHeaderRow">
                  <p className="conciergeBookingDetailsLabel">Price:</p>
                  <p className="conciergeBookingDetailsValue">{menuItem.price ? `$${menuItem.price}` : "?"}</p>
                </section>
              </section>
              { isCurrentlySelected
                ? (
                  <section className="conciergeBookedServicesAccordionItemContent">
                    {isEmpty(dialog)
                      ? <p>No information about decision tree</p>
                      : dialog.map((indexPair, dialogIndex) => (
                        <section className="conciergeBookedServicesQuestionBlock" key={indexPair[0]}>
                          <p className="conciergeBookingDetailsLabel">
                            Question
                            {dialogIndex + 1}
                          </p>
                          <p className="conciergeBookingDetailsValue">{correspondingDecisionTree.details[indexPair[0]].text}</p>
                          <p className="conciergeBookedServicesQuestionBlockAnswer">
                            {correspondingDecisionTree.details[indexPair[1]].text}
                          </p>
                        </section>
                      ))}
                    {
                    menuItem.additional_note
                      ? (
                        <section className="conciergeBookedServicesQuestionBlock">
                          <p className="conciergeBookingDetailsLabel">Additional Note</p>
                          <p className="conciergeBookingDetailsValue">{menuItem.additional_note}</p>
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
      </section>
    );
  }

  render() {
    const { menu_items } = this.props.booking;

    return (
      <section className="conciergeBookedServicesBlock">
        <p className="conciergeBookedServicesTitle">Booked services</p>
        {
          isEmpty(menu_items)
            ? this.getNoInfoBlock()
            : this.getAccordionWithData()
        }
      </section>
    );
  }
}

BookedServicesBlock.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  booking: object,
};

BookedServicesBlock.defaultProps = {
  booking: null,
};

export default BookedServicesBlock;
