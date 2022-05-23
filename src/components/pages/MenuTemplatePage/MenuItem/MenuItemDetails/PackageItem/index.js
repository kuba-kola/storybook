import React, { Component } from "react";
import { func } from "prop-types";
import { connect } from "react-redux";
import Select from "react-select";

import { savePackageItems } from "store/actions/menu-template-actions";
import { menuTemplatePropType, menuItemPropType } from "shared/prop-types";

import "./styles.scss";

class PackageItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      packageItems: this.props.menuItem.package_items,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props !== nextProps) {
      this.setState({ packageItems: nextProps.menuItem.package_items });
      return true;
    } if (this.state !== nextState) {
      return true;
    }
    return false;
  }

  options = (menuItems) => (
    menuItems.filter((menuItem) => this.availablePackageItem(menuItem)).map(this.mapForSelect)
  );

  availablePackageItem = (menuItem) => (
    !this.state.packageItems.find((pi) => pi.id === menuItem.id)
      && menuItem.id !== this.props.menuItem.id
      && menuItem.package_items.length === 0
  )

  edit = () => this.setState({ isEditing: true });

  save = () => {
    this.props.savePackageItems(this.props.menuItem.id, this.state.packageItems);
    this.setState({ isEditing: false });
  };

  handlePackageItemChange = (packageItems) => this.setState({
    packageItems: packageItems.map((vs) => vs.packageItem),
  })

  mapForSelect = (pi) => ({ packageItem: pi, value: pi.id, label: pi.name });

  render() {
    const { isEditing, packageItems } = this.state;
    const { menuItem: { kind }, menuTemplate: { menu_items: groupedMenuItems } } = this.props;
    const menuItems = groupedMenuItems[kind];

    return (
      <div className="packageItem">
        <div className="packageItemInputContainer">
          <span className="packageItemInputLabel">Package items</span>
          <Select
            isMulti
            value={packageItems.map(this.mapForSelect)}
            options={this.options(menuItems)}
            isDisabled={!isEditing}
            onChange={this.handlePackageItemChange}
            className="packageItemInputDropdown"
            classNamePrefix="packageItemInputDropdown"
          />
        </div>
        {isEditing ? (
          <button type="button" className="packageItemActionButton" onClick={this.save}>Save</button>
        ) : (
          <button type="button" className="packageItemActionButton" onClick={this.edit}>Edit</button>
        )}
      </div>
    );
  }
}

PackageItem.propTypes = {
  menuTemplate: menuTemplatePropType.isRequired,
  menuItem: menuItemPropType.isRequired,
  savePackageItems: func.isRequired,
};

const actions = {
  savePackageItems,
};

const PackageItemContainer = connect(null, actions)(PackageItem);

export default PackageItemContainer;
