import { GraphQLServer } from 'graphql-yoga'
import { uuid } from 'uuidv4'

//Demo users data
let users = [{
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

let comments = [{
  id: '1',
  text: 'Im learning right now',
  author: '3',
  post: '36'
}, {
  id: '2',
  text: 'This is Graphql',
  author: '2',
  post: '22'
}, {
  id: '3',
  text: 'Graphql is amazing',
  author: '1',
  post: '11'
}, {
  id: '4',
  text: 'I love graphql',
  author: '2',
  post: '36'
}]

let posts = [{
  id: '11',
  title: 'First post',
  body: 'Pay the water bill',
  published: true,
  author: '1'
}, {
  id: '22',
  title: 'Second post',
  body: 'College tasks',
  published: false,
  author: '31'
}, {
  id: '36',
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

  type Mutation {
    createUser(data: CreateUserInput!): User!
    deleteUser(id: ID!): User!
    createPost(data: CreatePostInput): Post!
    createComment(data: CreateCommentInput): Comment!
  }

  input CreateCommentInput {
    text: String!
    author: ID!
    post: ID!
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
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
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
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
  Mutation: {
    createUser(parent, args, ctx, info) {
      const takenEmail = users.some((user) => {
        return user.email === args.data.email
      })
      
      if (takenEmail) {
        throw new Error('Email taken.')
      }

      const user = {
        id: uuid(),
        ...args.data
      }

      users.push(user)
      return user
    },
    deleteUser(parent, args, ctx, info) {
      const userIndex = users.findIndex((user) => user.id === args.id)

      if (userIndex === -1) {
        throw new Error('User not found.')
      }

      const deletedUsers = users.splice(userIndex, 1)
      posts = posts.filter((post) => {
        const match = post.author === args.id
        if (match) {
          comments = comments.filter((comment) => comment.post !== post.id)
        }
        return !match
      })
      comments.filter((comment) => {
        return comment.author !== args.id
      })

      return deletedUsers[0]
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.data.author)

      if (!userExists) {
        throw new Error('User not found')
      }

      const post = {
        id: uuid(),
        ...args.data
      }

      posts.push(post)

      return post
    }, 
    createComment(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.data.author)
      const postExists = posts.some((post) => {
        return post.id === args.data.post && post.published
      })

      if (!userExists || !postExists) {
        throw new Error('Unable to find user and post')
      }

      const comment = {
        id: uuid(),
        ...args.data
      }

      comments.push(comment)
      return comment
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author
      })
    }, 
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.post === parent.id
      })
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author
      })
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => {
        return post.id === parent.post
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

const options = {
  port: 3000
}

server.start(options, ({ port }) => {
  console.log(`The server is up on port ${port}`)
})