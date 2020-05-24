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
  
  const posts = [{
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
 
const db = {
  users,
  posts,
  comments
}

export { db as default }