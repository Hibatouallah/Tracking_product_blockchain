import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from "./containers/AppliedRoute";
import NotFound from "./containers/NotFound";
import Home from "./Home.js"
import Addproduct from "./Addproduct"
import Searchproduct from "./Searchproduct"
export default ({ childProps }) =>
  <Switch>
    { /* routes */ }
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/Addproduct" exact component={Addproduct} props={childProps} />
    <AppliedRoute path="/Searchproduct" exact component={Searchproduct} props={childProps} />
    
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>