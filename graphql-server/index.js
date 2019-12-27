const { ApolloServer, gql } = require('apollo-server');
const axios = require('axios');
require('dotenv').config();

const typeDefs = gql`
  type Film {
    id: String!,
    posterPath: String!,
    title: String!
  }

  type Query {
    author: [Author]
    books: [Book]
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
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 5000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});