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

const comments = [{
  id: '1',
  text: 'Im learning right now',
  author: '3'
}, {
  id: '2',
  text: 'This is Graphql',
  author: '2'
}, {
  id: '3',
  text: 'Graphql is amazing',
  author: '1'
}, {
  id: '4',
  text: 'I love graphql',
  author: '2'
}]

const posts = [{
  id: '1',
  title: 'First post',
  body: 'Pay the water bill',
  published: true,
  author: '1'
}, {
  id: '2',
  title: 'Second post',
  body: 'College tasks',
  published: false,
  author: '1'
}, {
  id: '3',
  title: 'Third post',
  body: 'Clear the house',
  published: true,
  author: '2'
}]

//Type definitions (schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    me: User!
    post: Post!
    comments: [Comment!]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
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
    comments(parent, args, ctx, info) {
      return comments
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
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author
      })
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author
      })
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return post.author === parent.id
      })
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.author === parent.id
      })
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