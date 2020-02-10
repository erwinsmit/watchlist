const { RESTDataSource } = require('apollo-datasource-rest');
const firebase = require('firebase');
const { map, find } = require('lodash');

if (!firebase.apps.length) {
    firebase.initializeApp({
        databaseURL: 'https://watched-films.firebaseio.com/',
    });
}

class WatchListApi extends RESTDataSource {
    constructor() {
        super();
    }

    ref(path) { return  firebase.database().ref(path); }
    getValue(path) { return this.ref(path).once('value'); };
    getEntities(path) { return this.getValue(path).then(this.mapSnapshotToEntities); }
    mapSnapshotToEntities(snapshot) {
        return map(snapshot.val(), (value, id) => {
            value.id = id;

            return value;
        });
    }

    async getWatchListItems(userId) {
        return await this.getEntities(`watchlist/${userId}`);
    }

    async getWatchListItemByFilmId(userId, filmId) {
        const watchListItems = await this.getEntities(`watchlist/${userId}`);
        // TODO: filter directly on firebase?
        return watchListItems ? watchListItems.find(wl => wl.filmId === filmId) : null;
    }

    async addFilmToWatchList(userId, filmId) {
        const watchListItems = await this.getEntities(`watchlist/${userId}`);
        let watchListItemExists;

        for (let watchListItem of watchListItems) {
            if (watchListItem.filmId === filmId) {
                watchListItemExists = watchListItem;
            }
        }

        if (watchListItemExists) {
            return watchListItemExists;
        }

        firebase.database().ref(`watchlist/${userId}`).push({
            filmId: filmId
        });

        return {
            filmId: filmId
        }
    }

    async removeFilmFromWatchList(userId, filmId) {
        const watchListItems = await this.getEntities(`watchlist/${userId}`);
        const ref = firebase.database().ref(`watchlist/${userId}`);

        for (const watchListItem of watchListItems) {
            if (watchListItem.filmId === filmId) {
                await ref.child(watchListItem.id).remove();
            }
        }
    }
}

module.exports.WatchListApi = WatchListApi;