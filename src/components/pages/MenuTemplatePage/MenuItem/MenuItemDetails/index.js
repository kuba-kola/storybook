import React from "react";
import { func } from "prop-types";
import { connect } from "react-redux";

import { menuItemPropType, menuTemplatePropType } from "shared/prop-types";
import { addNewVehicleGroup, saveMenuItemTeamTags } from "store/actions/menu-template-actions";
import { settingsTeamTagsSelector } from "store/selectors/settings-selectors";

import MultiTagSelect from "components/common/MultiTagSelect";
import VehicleGroup from "./VehicleGroup";
import DecisionTree from "./DecisionTree";
import PackageItem from "./PackageItem";
import Extras from "./Extras";

import "./styles.scss";

const MenuItemDetails = ({
  menuItem,
  menuTemplate,
  teamTags,
  onAddNew,
  onUpdateMenuItemTeamTags,
}) => (
  <div className="menuItemDetails">
    {menuItem.kind === "concern" && (
      <section className="menuItemDetailsSection">
        <span className="menuItemDetailsSectionLabel">Decision tree</span>
        <div className="menuItemDetailsContainer">
          <DecisionTree menuItemId={menuItem.id} decisionTree={menuItem.decision_tree} />
        </div>
      </section>
    )}
    <section className="menuItemDetailsSection">
      <span className="menuItemDetailsSectionLabel">Vehicle groups</span>
      <div className="menuItemDetailsContainer">
        {menuItem.menu_item_targets.map((vehicleGroup) => (
          <VehicleGroup
            key={vehicleGroup.id}
            menuItemId={menuItem.id}
            menuItemKind={menuItem.kind}
            forDefault={menuItem.default}
            vehicleGroup={vehicleGroup}
            hasPackageItems={menuItem.package_items.length > 0}
          />
        ))}
        <button
          type="button"
          className="menuItemDetailsAddVehicleGroup"
          onClick={() => onAddNew(menuItem.id, menuItem.kind)}
        >
          Add new group
        </button>
      </div>
    </section>
    <section className="menuItemDetailsSection">
      <span className="menuItemDetailsSectionLabel">Package items</span>
      <div className="menuItemDetailsContainer">
        <PackageItem
          key={menuItem.id}
          menuItem={menuItem}
          menuTemplate={menuTemplate}
        />
        <Extras
          menuItemId={menuItem.id}
          currentExtras={menuItem.extras}
          enabled={menuItem.package_items.length > 0}
        />
      </div>
    </section>
    <section className="menuItemDetailsSection">
      <span className="menuItemDetailsSectionLabel">Team tags</span>
      <div className="menuItemDetailsContainer">
        <MultiTagSelect
          label="Team tags"
          options={teamTags}
          value={menuItem.team_tags}
          onChange={(selected) => {
            onUpdateMenuItemTeamTags(menuItem.id, selected.map(({ id }) => id));
          }}
        />
      </div>
    </section>
  </div>
);

MenuItemDetails.propTypes = {
  menuItem: menuItemPropType.isRequired,
  menuTemplate: menuTemplatePropType.isRequired,
  onAddNew: func.isRequired,
};

const mapStateToProps = (state) => ({
  teamTags: settingsTeamTagsSelector(state),
});

const actions = {
  onAddNew: addNewVehicleGroup,
  onUpdateMenuItemTeamTags: saveMenuItemTeamTags,
};

const MenuItemDetailsContainer = connect(mapStateToProps, actions)(MenuItemDetails);

export default MenuItemDetailsContainer;
