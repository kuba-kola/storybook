import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import "mutationobserver-shim";
import thunk from "redux-thunk";
import rootReducer from "reducers";
import App from ".";

global.MutationObserver = window.MutationObserver;

const store = createStore(rootReducer, applyMiddleware(thunk));

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>,
    div,
  );
  ReactDOM.unmountComponentAtNode(div);
});
