const { ApolloServer, gql } = require('apollo-server');
const axios = require('axios');
const firebase = require('firebase');
const { filter, map } = require('lodash');

require('dotenv').config();

const typeDefs = gql`
  type Film {
    id: String!,
    posterPath: String,
    title: String!
  }

  type WatchListItem {
    id: String!
    filmId: String!
    movieInfo: Film
  }

  type Query {
    films: [Film]
    searchFilms(searchTerm: String!): [Film]
    watchListItems(userId: String!): [WatchListItem]
  }

  type Mutation {
    addFilmToWatchList(filmId: String!, userId: String!): WatchListItem
  }
`;

firebase.initializeApp({
  databaseURL: 'https://watched-films.firebaseio.com/',
});

const ref = path => firebase.database().ref(path)
const getValue = path => ref(path).once('value')
const mapSnapshotToEntities = snapshot => {
    return map(snapshot.val(), (value, id) => {
        value.id = id;
    
        return value;

    })
}
const getEntities = path => getValue(path).then(mapSnapshotToEntities)

const resolvers = {
  Query: {
    films() {
      return axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.API}&language=en-US&page=1`)
        .then(res => {
          const movies = res.data.results;
          movies.map(movie => movie.posterPath = "https://image.tmdb.org/t/p/w500" + movie.poster_path
          )
          return movies
        });
    },
    searchFilms(parentValue, args) {
      return axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.API}&query=${args.searchTerm}&page=1'`)
      .then(res => {
        const films = res.data.results;
        films.map(movie => movie.posterPath = "https://image.tmdb.org/t/p/w500" + movie.poster_path)
        return films
      });
    },
    watchListItems: async(parentValue, args) => {
      const watchListItems = await getEntities(`watchlist/${args.userId}`);
      
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
  Mutation: {
    addFilmToWatchList: async(parentValue, args) => {
      const film = await axios.get(`https://api.themoviedb.org/3/movie/${args.filmId}?api_key=${process.env.API}&language=en-US&page=1`);  
      const watchListItems = await getEntities(`watchlist/${args.userId}`);
      let watchListItemExists; 

      for (let watchListItem of watchListItems) {
        if (watchListItem.filmId === args.filmId) {
          watchListItemExists = {
            ...watchListItem,
            movieInfo: {
              id: film.data.id,
              title: film.data.title,
              posterPath: "https://image.tmdb.org/t/p/w500" + film.data.poster_path    
            }
          }
        }
      }

      if (watchListItemExists) {
        return watchListItemExists;
      }

      firebase.database().ref(`watchlist/${args.userId}`).push({
        filmId: args.filmId
      });

      return {
        filmId: args.filmId,
        movieInfo: {
          id: film.data.id,
          title: film.data.title,
          posterPath: "https://image.tmdb.org/t/p/w500" + film.data.poster_path
        }
      }
    },
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 5000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});