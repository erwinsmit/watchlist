const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const { FilmsApi } = require('./films/datasource');

require('dotenv').config();

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
    films(parentValue, args, { dataSources }) {
      return dataSources.filmsApi.getTrendingFilms();
    },
    searchFilms(parentValue, args, { dataSources }) {
      return dataSources.filmsApi.getFilmsBySearchTerm(args.searchTerm);
    },
  },
  Film: {
    __resolveReference(reference, { dataSources }) {
      return dataSources.filmsApi.getFilmById(reference.id);
    },
    watchListItem(film, args) {
      return { __typename: "WatchListItem", filmId: film.id, userId: args.userId };
    },
  }
};

const server = new ApolloServer({
  dataSources: () => {
    return {
      filmsApi: new FilmsApi(),
    };
  },
  schema: buildFederatedSchema([{ 
    typeDefs, 
    resolvers
  }]),
  context: async ({ req }) => {
    const userId = req.headers.userid;

    return {
      userId: userId
    }
  }
})

server.listen({ port: 5003 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});