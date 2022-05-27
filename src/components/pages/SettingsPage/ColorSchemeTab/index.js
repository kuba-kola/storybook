import React, { useState } from "react";
import { object, func } from "prop-types";
import { connect } from "react-redux";
import ReactTable from "react-table-6";

import Button from "components/common/Button";
import Panel from "components/common/Panel";
import { updateColorScheme } from "store/actions/settings-actions";

import defaultColorScheme from "./default-color-scheme.json";
import "./styles.scss";

const ColorSchemeTab = ({ dealershipColorScheme, submitColorScheme }) => {
  const [colorScheme, setColorScheme] = useState({
    ...defaultColorScheme,
    ...dealershipColorScheme,
  });

  const changeVariable = (key) => (event) => setColorScheme({
    ...colorScheme,
    [key]: event.target.value,
  });

  const resetVariable = (key) => () => setColorScheme({
    ...colorScheme,
    [key]: defaultColorScheme[key],
  });

  const data = Object.keys(colorScheme).map((key) => ({ key, value: colorScheme[key] }));
  const columns = [
    {
      Header: "Variable",
      accessor: "key",
    },
    {
      Header: "Value",
      accessor: "key",
      // eslint-disable-next-line react/prop-types
      Cell: ({ value }) => (
        <input value={colorScheme[value]} onChange={changeVariable(value)} />
      ),
    },
    {
      Header: "Preview",
      accessor: "value",
      // eslint-disable-next-line react/prop-types
      Cell: ({ value }) => (
        <div
          className="conciergeSettingsColorSchemePreview"
          style={{ background: value }}
        />
      ),
    },
    {
      Header: "Actions",
      accessor: "key",
      // eslint-disable-next-line react/prop-types
      Cell: ({ value }) => (
        <Button
          className="conciergeSettingsColorSchemeReset"
          onClick={resetVariable(value)}
        >
          Reset
        </Button>
      ),
    },
  ];

  return (
    <Panel
      header={<p className="conciergeBookingDetailsPanelHeader">CSS variables</p>}
    >
      <ReactTable
        columns={columns}
        data={data}
        pageSize={data.length}
        showPagination={false}
      />
      <div className="conciergeSettingsColorSchemeFooter">
        <Button
          variant="destructive"
          onClick={() => setColorScheme(defaultColorScheme)}
        >
          <p>Reset all to defaults</p>
        </Button>
        <Button
          variant="brand"
          style={{ marginLeft: "16px " }}
          onClick={() => submitColorScheme(colorScheme)}
        >
          <p>Update color scheme</p>
        </Button>
      </div>
    </Panel>
  );
};

ColorSchemeTab.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  dealershipColorScheme: object.isRequired,
  submitColorScheme: func.isRequired,
};

const actions = {
  submitColorScheme: updateColorScheme,
};

export default connect(null, actions)(ColorSchemeTab);
