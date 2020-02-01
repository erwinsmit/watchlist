const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const axios = require('axios');
const firebase = require('firebase');
const { map } = require('lodash');

const admin = require('firebase-admin');
const serviceAccount = require("../../service-account.json");

const firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://watched-films.firebaseio.com/'
});


require('dotenv').config();

const typeDefs = gql`
  type WatchListItem @key(fields: "id") {
    id: ID!
    filmId: String!
    film: Film @provides(fields: "id")
  }

  extend type Film @key(fields: "id") {
    id: ID! @external
  }

  type Query {
    watchListItems: [WatchListItem]
  }

  type Mutation {
    addFilmToWatchList(filmId: String!): WatchListItem
    removeFilmFromWatchList(filmId: String!): WatchListItem
  }  
`;

firebase.initializeApp({
    databaseURL: 'https://watched-films.firebaseio.com/',
});

const ref = path => firebase.database().ref(path);
const getValue = path => ref(path).once('value');
const getEntities = path => getValue(path).then(mapSnapshotToEntities);
const mapSnapshotToEntities = snapshot => {
    return map(snapshot.val(), (value, id) => {
        value.id = id;

        return value;

    })
}

const resolvers = {
    Query: {
        watchListItems: async (parentValue, args, context) => {
            const watchListItems = await getEntities(`watchlist/${context.userId}`)

            for (let watchListItem of watchListItems) {
                const film = await axios.get(`https://api.themoviedb.org/3/movie/${watchListItem.filmId}?api_key=${process.env.API}&language=en-US&page=1`);
                watchListItem.movieInfo = {
                    id: film.data.id,
                    title: film.data.title,
                    posterPath: "https://image.tmdb.org/t/p/w500" + film.data.poster_path
                }
            }

            return watchListItems;
        }
    },
    WatchListItem: {
        async __resolveReference(reference, context) {
            const watchListItems = await getEntities(`watchlist/${context.userId}`);
            return watchListItems.find(wl => wl.filmId === reference.filmId);
        },
        film(watchListItem) {
            return { __typename: "Film", id: watchListItem.filmId };
        }
    },
    Mutation: {
        addFilmToWatchList: async (parentValue, args, context) => {
            const watchListItems = await getEntities(`watchlist/${context.userId}`);
            let watchListItemExists;

            for (let watchListItem of watchListItems) {
                if (watchListItem.filmId === args.filmId) {
                    watchListItemExists = watchListItem;
                }
            }

            if (watchListItemExists) {
                return watchListItemExists;
            }

            firebase.database().ref(`watchlist/${context.userId}`).push({
                filmId: args.filmId
            });

            return {
                filmId: args.filmId
            }
        },
        removeFilmFromWatchList: async(parentValue, args, context) => {
            const watchListItems = await getEntities(`watchlist/${context.userId}`);
            const ref = firebase.database().ref(`watchlist/${context.userId}`);

            for (let watchListItem of watchListItems) {
                if (watchListItem.filmId === args.filmId) {
                    await ref.child(watchListItem.id).remove();
                }
            }
        }
    }
};

const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }]),
    context: async ({ req }) => {
        const userId = req.headers.userid;

        return {
            userId: userId
        }
    }
})

server.listen({ port: 5002 }).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});