const { ApolloServer, gql, AuthenticationError } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const { WatchListApi } = require('./watchList/datasource');

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

const resolvers = {
    Query: {
        watchListItems: async (parentValue, args, { dataSources, userId }) => {
            if (!userId) {
                throw new AuthenticationError('User not authenticated');
            }

            return dataSources.watchListApi.getWatchListItems(userId);
        }
    },
    WatchListItem: {
        async __resolveReference({filmId}, context) {
            if (!context.userId) {
                return null;
            }
            
            return context.dataSources.watchListApi.getWatchListItemByFilmId(context.userId, filmId);
        },
        film(watchListItem) {
            return { __typename: "Film", id: watchListItem.filmId };
        }
    },
    Mutation: {
        addFilmToWatchList: async (parentValue, args, context) => {
            if (!context.userId) {
                throw new AuthenticationError('User not authenticated');
            }

            return context.dataSources.watchListApi.addFilmToWatchList(context.userId, args.filmId);
        },
        removeFilmFromWatchList: async(parentValue, args, context) => {
            return context.dataSources.watchListApi.removeFilmFromWatchList(context.userId, args.filmId);
        }
    }
};

const server = new ApolloServer({
    dataSources: () => {
        return {
            watchListApi: new WatchListApi(),
        };
    },
    schema: buildFederatedSchema([{ typeDefs, resolvers }]),
    context: async ({ req }) => {
        const userId = req.headers.userid;
    
        return {
            userId: userId
        }
    },
    tracing: true
})

server.listen({ port: 5002 }).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});