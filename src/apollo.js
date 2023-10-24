import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
} from "@apollo/client";

const httpLink = createHttpLink({ uri: "http://localhost:4000/graphql" });
const authLink = new ApolloLink((operation, forward) => {
  operation.setContext((context) => ({
    headers: {
      ...context.headers,
    },
  }));
  return forward(operation);
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  connectToDevTools: true,
});
