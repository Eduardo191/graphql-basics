import { GraphQLServer } from 'graphql-yoga'

//Demo users data
const users = [{
  id: '1',
  name: 'Eduardo',
  email: 'edu@example.com',
  age: 19
}, {
  id: '2',
  name: 'Sarah',
  email: 'sarah@example.com',
  age: 23
}, {
  id: '3',
  name: 'James',
  email: 'james@example.com',
  age: 56
}]

const posts = [{
  id: '1',
  title: 'First post',
  body: 'Pay the water bill',
  published: true
}, {
  id: '2',
  title: 'Second post',
  body: 'College tasks',
  published: false
}, {
  id: '3',
  title: 'Third post',
  body: 'Clear the house',
  published: true
}]

//Type definitions (schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
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
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users
      }

      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase())
      })
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts
      }

      return posts.filter((post) => {
        const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
        const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
        return isTitleMatch || isBodyMatch  
      })
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