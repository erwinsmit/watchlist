const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require("@apollo/gateway");

const server = new ApolloServer({
  gateway: new ApolloGateway({
    serviceList: [
      { name: "watchListItems", url: "http://localhost:5002" },
      { name: "films", url: "http://localhost:5003" },
    ]
  }),
  subscriptions: false
});

server.listen({ port: 5001 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
