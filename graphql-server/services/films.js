const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const axios = require('axios');

require('dotenv').config();
// 
 

const typeDefs = gql`
  type Film @key(fields: "id") {
    id: ID!
    posterPath: String
    title: String!
    watchListItem: WatchListItem @provides(fields: "filmId")
  }

  extend type WatchListItem @key(fields: "filmId") {
    filmId: String! @external
    id: ID! @external
  }
   
  type Query {
    films: [Film]
    searchFilms(searchTerm: String!): [Film]
  }
`;

const resolvers = {
  Query: {
    films() {
      return axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.API}&language=en-US&page=1`)
        .then(res => {
          const movies = res.data.results;
          movies.map(movie => movie.posterPath = "https://image.tmdb.org/t/p/w500" + movie.poster_path);
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
  },
  Film: {
    __resolveReference(reference) {
      return axios.get(`https://api.themoviedb.org/3/movie/${reference.id}?api_key=${process.env.API}`).then(res => {
        const film = res.data;
        film.posterPath = "https://image.tmdb.org/t/p/w500" + film.poster_path;
        return film;
      });
    },
    watchListItem(film, args) {
      console.log('film reference', args);
      return { __typename: "WatchListItem", filmId: film.id, userId: args.userId };
    },
    film(watchListItem, ...rest) {
      return { __typename: "Film", id: watchListItem.filmId };
    }
  }
};

// const server = new ApolloServer({ typeDefs, resolvers });
const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
  context: async({ req }) => {
      console.log('token', JSON.stringify(req.headers.userid));

      const userId = req.headers.userid;
  
      return {
          userId: userId
      }
  }
})

server.listen({ port: 5003 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});