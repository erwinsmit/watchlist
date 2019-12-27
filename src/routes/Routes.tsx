import React from 'react';

import { Route, Switch } from "react-router";
import { Home } from '../home/Home';

export const Routes: React.FC = () => {
    return (
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <Route path="/watchlist">
                Watchlist
            </Route>
        </Switch>
    )
}