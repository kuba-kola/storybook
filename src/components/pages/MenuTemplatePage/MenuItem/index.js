import React, { useState } from "react";
import { func } from "prop-types";
import { connect } from "react-redux";
import Switch from "react-switch";
import { deleteMenuItem, toggleMenuItemDefaultRO } from "store/actions/menu-template-actions";
import { menuItemPropType, menuTemplatePropType } from "shared/prop-types";
import arrowUpIcon from "assets/images/up.svg";
import menuIcon from "assets/images/menu.svg";
import editIcon from "assets/images/edit.svg";
import deleteIcon from "assets/images/delete.svg";
import duplicateIcon from "assets/images/duplicate.svg";
import Modal from "components/common/Modal";
import MenuItemDetails from "./MenuItemDetails";
import EditModal from "./EditModal";
import "./styles.scss";

const MenuItem = ({
  onDeleteMenuItem,
  onDuplicate,
  onToggleDefaultRO,
  menuTemplate,
  menuItem,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [actionsPopupOpen, setActionsPopupOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isDefaultForRO, setIsDefaultForRO] = useState(menuItem.default_repair_order_item);

  return (
    <div className="position-relative">
      <div className={`menuItem ${isExpanded ? "isExpanded" : ""}`}>
        <button type="button" className="menuItemExpandButton isExpanded" onClick={() => setIsExpanded(!isExpanded)}>
          <img alt="collapse" src={arrowUpIcon} />
          {`${menuItem.op_code} - ${menuItem.name}`}
        </button>
        <div className="SwitchContainer menuItemAddToROSwitch">
          <label className="conciergeInputLabel" htmlFor="add-to-every-ro-switch">Add to every RO</label>
          <Switch
            id="add-to-every-ro-switch"
            className="Switch"
            onChange={() => {
              onToggleDefaultRO(menuItem.id, !isDefaultForRO);
              setIsDefaultForRO(!isDefaultForRO);
            }}
            checked={isDefaultForRO}
            onColor="#36af5e"
            offColor="#dedee0"
            activeBoxShadow="0 0 2px 3px #0bcaf9"
            aria-labelledby="add-to-every-ro-switch-lable"
          />
        </div>
        <button type="button" className="menuItemActionsButton isExpanded" onClick={() => setActionsPopupOpen(!actionsPopupOpen)}>
          <img alt="actions" src={menuIcon} />
        </button>
      </div>
      {isExpanded && <MenuItemDetails menuItem={menuItem} menuTemplate={menuTemplate} />}
      {actionsPopupOpen && (
        <>
          <div className="menuItemActionsPopup">
            <button
              type="button"
              className="menuItemAction menuItemActionEditName"
              onClick={() => {
                setEditModalOpen(true);
                setActionsPopupOpen(false);
              }}
            >
              <img alt="edit" src={editIcon} />
              Edit
            </button>
            <button
              type="button"
              className="menuItemAction"
              onClick={() => {
                setActionsPopupOpen(!actionsPopupOpen);
                onDuplicate();
              }}
            >
              <img alt="duplicate" src={duplicateIcon} />
              Duplicate
            </button>
            <button
              type="button"
              className="menuItemAction menuItemActionDelete"
              onClick={() => {
                setDeleteModalOpen(true);
                setActionsPopupOpen(false);
              }}
            >
              <img alt="delete" src={deleteIcon} />
              Delete
            </button>
          </div>
          <button
            type="button"
            className="menuItemActionsOutsideOverlay"
            onClick={() => actionsPopupOpen(false)}
          />
        </>
      )}
      {editModalOpen && (
        <EditModal
          id={menuItem.service_id}
          menuItemId={menuItem.id}
          menuTemplateId={menuTemplate.id}
          kind={menuItem.kind}
          name={menuItem.name}
          onClose={() => setEditModalOpen(false)}
        />
      )}
      {deleteModalOpen && (
        <Modal
          title="Wait. Are you sure?"
          text="Are you sure you want to delete this item and all of its vehicle groups / decision trees?"
          cancelButtonText="No"
          submitButtonText="Yes"
          submitButtonVariant="destructive"
          cancelButtonVariant="dark"
          size="small"
          onSubmit={() => onDeleteMenuItem(menuTemplate.id, menuItem.id)}
          onCancel={() => setDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};

MenuItem.propTypes = {
  menuTemplate: menuTemplatePropType.isRequired,
  menuItem: menuItemPropType.isRequired,
  onDuplicate: func.isRequired,
  onDeleteMenuItem: func.isRequired,
  onToggleDefaultRO: func.isRequired,
};

const actions = {
  onDeleteMenuItem: deleteMenuItem,
  onToggleDefaultRO: toggleMenuItemDefaultRO,
};

const MenuItemContainer = connect(null, actions)(MenuItem);

export default MenuItemContainer;
