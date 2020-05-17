import { GraphQLServer } from 'graphql-yoga'

//Type definitions (schema)
const typeDefs = `
  type Query {
    hello : String!
    name: String!
    location: String!
    bio: String!
  }
`

//Resolvers
const resolvers = {
  Query: {
    hello() {
      return 'This is my first query!'
    },
    name() {
      return 'Eduardo'
    },
    location() {
      return 'São Paulo, Brazil'
    },
    bio() {
      return 'I am a developer'
    }
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
})

server.start(() => {
  console.log('The server is up!')
})