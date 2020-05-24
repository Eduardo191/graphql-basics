const Query = {
    users(parent, args, { db }, info) {
      if (!args.query) {
        return db.users
      }

      return db.users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase())
      })
    },
    comments(parent, args, { db }, info) {
      return db.comments
    },
    posts(parent, args, { db }, info) {
      if (!args.query) {
        return db.posts
      }

      return db.posts.filter((post) => {
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

export default Query