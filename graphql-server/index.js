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
    movieId: String!
    userEmail: String!
    movieInfo: Film
  }

  type Query {
    films: [Film]
    searchFilms(searchTerm: String!): [Film]
    watchListItems(userEmail: String!): [WatchListItem]
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
      const watchListItems = await getEntities('watchlist');
      const filtered = filter(watchListItems, { userEmail: args.userEmail });
      const enriched = [];
    
      for (let filteredItem of filtered) {
        const film = await axios.get(`https://api.themoviedb.org/3/movie/${filteredItem.movieId}?api_key=${process.env.API}&language=en-US&page=1`);
        filteredItem.movieInfo = {
          id: film.data.id,
          title: film.data.title,
          posterPath: "https://image.tmdb.org/t/p/w500" + film.data.poster_path
        }
      }

      return filtered;
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 5000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});