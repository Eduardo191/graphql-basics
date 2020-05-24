import { uuid } from 'uuidv4'

const Mutation = {
    createUser(parent, args, { db }, info) {
      const takenEmail = db.users.some((user) => {
        return user.email === args.data.email
      })
      
      if (takenEmail) {
        throw new Error('Email taken.')
      }

      const user = {
        id: uuid(),
        ...args.data
      }

      db.users.push(user)
      return user
    },
    updateUser(parent, { id, data }, { db }, info) {
      const user = db.users.find((user) => user.id === id)

      if (!user) {
        throw new Error('User not found')
      }

      if (typeof data.email === 'string') {
        const emailTaken = db.users.some((user) => user.email === data.email)

        if (emailTaken) {
          throw new Error('Email taken')
        }

        user.email = data.email
      }

      if (typeof data.name === 'string') {
        user.name = data.name
      }

      if (typeof data.age !== 'undefined') {
        user.age = data.age
      }

      return user
    },
    updatePost(parent, args, { db }, info) {
      const post = db.posts.find((post) => args.id === post.id)

      if (!post) {
        throw new Error('Post not found')
      }

      if (typeof args.data.title === 'string') {
        post.title = args.data.title
      }

      if (typeof args.data.body === 'string') {
        post.body = args.data.body
      }

      if (typeof args.data.published === 'boolean') {
        post.published = args.data.published
      }

      return post
    },
    deleteUser(parent, args, { db }, info) {
      const userIndex = db.users.findIndex((user) => user.id === args.id)

      if (userIndex === -1) {
        throw new Error('User not found.')
      }

      const deletedUsers = db.users.splice(userIndex, 1)
      db.posts = db.posts.filter((post) => {
        const match = post.author === args.id
        if (match) {
          db.comments = db.comments.filter((comment) => comment.post !== post.id)
        }
        return !match
      })
      db.comments = db.comments.filter((comment) => {
        return comment.author !== args.id
      })

      return deletedUsers[0]
    },
    deletePost(parent, args, { db }, info) {
      const postIndex = db.posts.findIndex((post) => post.id === args.id)

      if (postIndex === -1) {
        throw new Error('Post not found')
      }

      
      db.comments = db.comments.filter((comment) => {
        return comment.post !== args.id
      })
      
      const deletedPosts = db.posts.splice(postIndex, 1)

      return deletedPosts[0]
    },
    deleteComment(parent, args, { db }, info) {
      const commentIndex = db.comments.findIndex((comment) => comment.id === args.id)
      
      if (commentIndex === -1) {
        throw new Error('Comment not found')
      }

      const deletedComments = db.comments.splice(commentIndex, 1)

      return deletedComments[0]
    },
    createPost(parent, args, { db }, info) {
      const userExists = db.users.some((user) => user.id === args.data.author)

      if (!userExists) {
        throw new Error('User not found')
      }

      const post = {
        id: uuid(),
        ...args.data
      }

      db.posts.push(post)

      return post
    }, 
    createComment(parent, args, { db }, info) {
      const userExists = db.users.some((user) => user.id === args.data.author)
      const postExists = db.posts.some((post) => {
        return post.id === args.data.post && post.published
      })

      if (!userExists || !postExists) {
        throw new Error('Unable to find user and post')
      }

      const comment = {
        id: uuid(),
        ...args.data
      }

      db.comments.push(comment)
      return comment
    },
    updateComment(parent, args, { db }, info) {
      const comment = db.comments.find((comment) => args.id === comment.id)

      if (!comment) {
        throw new Error('Comment not found')
      }

      if (typeof args.data.text === 'string') {
        comment.text = args.data.text
      }

      return comment
    }
}

export { Mutation as default }