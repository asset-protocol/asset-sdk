import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: 'http://3.87.189.32:3000/graphql',
  cache: new InMemoryCache()
});