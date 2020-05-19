import { GraphQLServer } from 'graphql-yoga'

//Type definitions (schema)
const typeDefs = `
  type Query {
    add(a: Float!, b: Float!): Float!
    greeting(name: String): String!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }
`

//Resolvers
const resolvers = {
  Query: {
    add(parent, args, ctx, info) {
      return args.a + args.b
    },
    greeting(parent, args, ctx, info) {
      if (args.name) {
        return `Hello ${args.name}!`
      }

      return 'Hello'
    },
    me() {
      return {
        id: '123908',
        name: 'Mike',
        email: 'mike@gmail.com',
        age: 27
      }
    },
    post() {
      return {
        id: '123098',
        title: 'My test post',
        body: 'This is my first post',
        published: true
      }
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