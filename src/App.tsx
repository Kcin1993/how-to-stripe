import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./container/home";

/**
 * Redux
 */
import { Provider } from "react-redux";
import reducers from "./store/reducers";
import storeConfiguration from "./store/storeConfiguration";
const store = storeConfiguration(reducers, null);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <Router>
            <Route path="" exact component={Home} />
          </Router>
        </div>
      </Provider>
    );
  }
}

export default App;
