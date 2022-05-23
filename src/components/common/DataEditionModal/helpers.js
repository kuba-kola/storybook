import React from "react";

export const renderDataEditionErrors = (error) => (
  <div className="dataEditionModalStatusBar dataEditionModalStatusBarRed font-lato">
    {
      !!Array.isArray(error)
        && error.map((err) => (
          err.message
        ))
    }
    {
      typeof error.error === "string" && error.error
    }
    {
      (!!error.error && !!error.error.error && !!error.error.error.message)
      && error.error.error.message
    }
    {
      typeof error === "string" && error
    }
  </div>
);
