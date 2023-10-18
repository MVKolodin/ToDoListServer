const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');


const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

let users = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Sarah Wann' },
  { id: 4, name: 'Albert Nicolson' },
  { id: 5, name: 'Leanne Graham' },
  { id: 6, name: 'Ervin Howell' },
  { id: 7, name: 'Patricia Lebsack' },
  { id: 8, name: 'Kurtis Weissnat' },
  { id: 9, name: 'Gienna Reichert' }
];

let todos = [
  { id: 1, title: 'Buy groceries', completed: false, userId: 1 },
  { id: 2, title: 'Read a book', completed: true, userId: 2 },
];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/todos', (req, res) => {
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const newTodo = {
    id: todos.length + 1,
    title: req.body.title,
    completed: false,
    userId: req.body.userId
  };
  todos.push(newTodo);
  res.json(newTodo);
});

app.put('/api/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  const todo = todos.find(todo => todo.id === todoId);
  if (todo) {
    todo.completed = req.body.completed;
    res.json(todo);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

app.delete('/api/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  todos = todos.filter(todo => todo.id !== todoId);
  res.json({ message: 'Todo deleted successfully' });
});




app.get('/api/users', (req, res) => {
  res.json(users);
});

app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(user => user.id === userId);

  if (!user) {
    res.status(404).json({ message: 'User not found' });
  } else {
    res.json(user);
  }
});

app.post('/api/users', (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name
  };

  users.push(newUser);
  res.json(newUser);
});

app.put('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const updatedUser = req.body;

  users = users.map(user => (user.id === userId ? updatedUser : user));

  res.json(updatedUser);
});

app.delete('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);

  users = users.filter(user => user.id !== userId);

  res.json({ message: 'User deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
