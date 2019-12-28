import React from 'react';

import { Route, Switch } from "react-router";
import { Home } from '../home/Home';
import { WatchList } from '../watchlist/WatchList'

export const Routes: React.FC = () => {
    return (
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <Route path="/watchlist">
                <WatchList />
            </Route>
        </Switch>
    )
}