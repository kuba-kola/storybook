import React, { Component } from "react";
import {
  string, func, object,
} from "prop-types";
import { connect } from "react-redux";
import ReactRouterPropTypes from "react-router-prop-types";
import { equals } from "ramda";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { NotificationContainer, NotificationManager } from "react-notifications";

import { fetchTemplate, reorderTemplateItems } from "store/actions/menu-template-actions";
import { menuTemplatePropType } from "shared/prop-types";
import { servicesTemplateSelector, servicesErrorSelector } from "store/selectors/menu-template-selectors";
import { dealershipIdSelector } from "store/selectors/app-selectors";
import { reorderItems } from "shared/utils/common";
import PageHeader from "components/common/PageHeader";

import AddMenuItemModal from "./AddMenuItemModal";
import MenuItem from "./MenuItem";
import "./styles.scss";

const GENERAL_KIND = "general";
const MAINTENANCE = "maintenance";
const CONCERN = "concern";
const EXTENSION = "extension";

const PageTitle = ({ templateName }) => <h2>{`Menu Templates / ${templateName}`}</h2>;
PageTitle.propTypes = { templateName: string.isRequired };

const SortableMenuItem = SortableElement(MenuItem);

const SortableList = SortableContainer(({ children }) => <div>{children}</div>);

const shouldCancelStart = (e) => {
  if (["input", "a", "select", "option", "button"].indexOf(e.target.tagName.toLowerCase()) !== -1) {
    return true;
  }
  return false;
};

class MenuTemplatePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      template: this.props.template,
      modal: {
        open: false,
        kind: null,
      },
    };
  }

  componentDidMount() {
    const { dealershipId, match: { params: { id } }, template } = this.props;

    this.props.fetchTemplate(dealershipId, id);
    this.setState({
      template,
    });
  }

  componentDidUpdate(prevProps) {
    const {
      dealershipId,
      match: { params: { id } },
      template,
      error,
    } = this.props;

    if (!this.state.template && dealershipId && prevProps.dealershipId !== dealershipId) {
      this.props.fetchTemplate(dealershipId, id);
    } else if (!equals(template, prevProps.template)) {
      this.setState({
        template,
      });
    }

    if (error) {
      NotificationManager.error(error.message, "Error");
    }
  }

  onSortEnd = ({ oldIndex, newIndex, collection }) => {
    this.setState((prevState) => ({
      ...prevState,
      template: {
        ...prevState.template,
        menu_items: {
          ...prevState.template.menu_items,
          [collection]:
          reorderItems(prevState.template.menu_items[collection], oldIndex, newIndex),
        },
      },
    }), () => this.sendItemsIds(this.state.template.menu_items[collection], collection));
  }

  sendItemsIds = (items, collection) => {
    const ids = items.map((item) => item.id);

    const params = {
      dealershipId: this.props.dealershipId,
      menuTemplateId: this.state.template.id,
      menuItemIds: ids,
      itemsKind: collection,
    };

    this.props.reorderTemplateItems(params);
  }

  newMenuItem = (kind) => () => this.setState({ modal: { open: true, kind } });

  duplicateItem = (item, kind) => () => this.setState({
    modal: {
      kind,
      open: true,
      duplicate: item,
    },
  });

  render() {
    const { template, modal } = this.state;

    if (!template) {
      return (
        <section className="menuTemplatePage">
          <PageHeader title={<PageTitle templateName="" />} />
          <section className="menuTemplatePageMain">
            <div className="menuTemplatePageInfoText">Loading...</div>
          </section>
        </section>
      );
    }

    const {
      id,
      name,
      kind,
      menu_items,
    } = template;

    return (
      <section className="menuTemplatePage">
        <PageHeader
          title={<PageTitle templateName={name} />}
        />
        <NotificationContainer />
        <div>
          {modal.open && (
            <AddMenuItemModal
              menuTemplateId={id}
              kind={modal.kind}
              duplicate={modal.duplicate}
              excludedServices={(menu_items[modal.kind] || []).map((m) => m.service_id)}
              onClose={() => this.setState({ modal: { open: false } })}
            />
          )}
          {kind === GENERAL_KIND ? (
            <section className="menuTemplatePageMain">
              <div className="menuTemplatePageServiceGroup">
                <div className="menuTemplatePageServiceGroupHeader">
                  Maintenance
                </div>
              </div>
              <SortableList
                onSortEnd={this.onSortEnd}
                distance={1}
                lockAxis="y"
                shouldCancelStart={shouldCancelStart}
              >
                {(menu_items.maintenance || []).map((item, index) => (
                  <SortableMenuItem
                    key={item.id}
                    index={index}
                    collection="maintenance"
                    menuTemplate={template}
                    menuItem={item}
                    onDuplicate={this.duplicateItem(item, MAINTENANCE)}
                  />
                ))}
              </SortableList>
              <button
                type="button"
                className="menuTemplatePageNewMenuItemButton"
                onClick={this.newMenuItem(MAINTENANCE)}
              >
                + Add new item
              </button>
              <div className="menuTemplatePageServiceGroup">
                <div className="menuTemplatePageServiceGroupHeader">
                  Concerns
                </div>
              </div>
              <SortableList
                onSortEnd={this.onSortEnd}
                distance={1}
                lockAxis="y"
                shouldCancelStart={shouldCancelStart}
              >
                {(menu_items.concern || []).map((item, index) => (
                  <SortableMenuItem
                    key={item.id}
                    index={index}
                    collection="concern"
                    menuTemplate={template}
                    menuItem={item}
                    onDuplicate={this.duplicateItem(item, CONCERN)}
                  />
                ))}
              </SortableList>
              <button
                type="button"
                className="menuTemplatePageNewMenuItemButton"
                onClick={this.newMenuItem(CONCERN)}
              >
                + Add new item
              </button>
            </section>
          ) : (
            <section className="menuTemplatePageMain">
              <div className="menuTemplatePageServiceGroup">
                <div className="menuTemplatePageServiceGroupHeader">
                  Extensions
                </div>
              </div>
              <SortableList
                onSortEnd={this.onSortEnd}
                distance={1}
                lockAxis="y"
                shouldCancelStart={shouldCancelStart}
              >
                {(menu_items.extension || []).map((item, index) => (
                  <SortableMenuItem
                    key={item.id}
                    index={index}
                    collection="extension"
                    menuTemplate={template}
                    menuItem={item}
                    onDuplicate={this.duplicateItem(item, EXTENSION)}
                  />
                ))}
              </SortableList>
              <button
                type="button"
                className="menuTemplatePageNewMenuItemButton"
                onClick={this.newMenuItem(EXTENSION)}
              >
                + Add new item
              </button>
            </section>
          )}
        </div>
      </section>
    );
  }
}

MenuTemplatePage.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
  template: menuTemplatePropType,
  fetchTemplate: func.isRequired,
  reorderTemplateItems: func.isRequired,
  dealershipId: string,
  // eslint-disable-next-line
  error: object,
};

MenuTemplatePage.defaultProps = {
  dealershipId: null,
  error: null,
  template: null,
};

const mapStateToProps = (state) => ({
  template: servicesTemplateSelector(state),
  dealershipId: dealershipIdSelector(state),
  error: servicesErrorSelector(state),
});

const actions = {
  fetchTemplate,
  reorderTemplateItems,
};

const MenuTemplatePageContainer = connect(mapStateToProps, actions)(MenuTemplatePage);

export default MenuTemplatePageContainer;
