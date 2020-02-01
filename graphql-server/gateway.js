const { ApolloServer } = require("apollo-server");
const { ApolloGateway, RemoteGraphQLDataSource  } = require("@apollo/gateway");
const admin = require('firebase-admin');
const serviceAccount = require("../service-account.json");

const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://watched-films.firebaseio.com/'
});

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }) {
    console.log('willSendRequest', JSON.stringify(request.query), context.userId);
    if (context.userId) {
      request.http.headers.set('userid', context.userId);
    }
  }
}

const gateway = new ApolloGateway({
  serviceList: [
    { name: "watchListItems", url: "http://localhost:5002" },
    { name: "films", url: "http://localhost:5003" },
  ],
  buildService({ name, url }) {
    return new AuthenticatedDataSource({ url });
  }
});

const server = new ApolloServer({
  gateway,
  context: async({ req, context }) => {
    const token = req.headers.authorization || "";
   
    try {
      const user = await firebaseApp.auth().verifyIdToken(token);
      return {
        userId: user.user_id
      }
    } catch(e) {
      console.error(e);
      return {
        userId: undefined
      }
    }
  },
  subscriptions: false
});

server.listen({ port: 5001 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
