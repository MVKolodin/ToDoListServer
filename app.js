const todoListElement = document.getElementById('todo-list');
const newTodoInput = document.getElementById('new-todo');
const userSelect = document.getElementById('user-todo');
const addButton = document.querySelector('form button');

let todos = [];
let users = [];

async function fetchData() {
    try {
        const todoResponse = await fetch('http://31.129.109.51/api/todos');
        const userResponse = await fetch('http://31.129.109.51/api/users');
        todos = await todoResponse.json();
        users = await userResponse.json();
        renderTodos();
        renderUsers();
    } catch (error) {
        alert( 'Error fetching data: ' + error );
    }
}


function renderTodos() {
    todoListElement.innerHTML = '';
    todos.forEach(todo => {
        const listItem = document.createElement('li');
        listItem.classList.add('todo-item');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => toggleTodoStatus(todo.id));

        const text = document.createElement('span');
        text.innerHTML = `${todo.title} by <strong>${getUserById(todo.userId).name}</strong>`;

        const closeBtn = document.createElement('span');
        closeBtn.classList.add('close');
        closeBtn.innerText = '×';
        closeBtn.addEventListener('click', () => deleteTodo(todo.id));

        listItem.appendChild(checkbox);
        listItem.appendChild(text);
        listItem.appendChild(closeBtn);
        todoListElement.appendChild(listItem);
    });
}

function getUserById(userId) {
    return users.find(user => user.id === userId) || { name: 'Unknown User' };
}


function renderUsers() {
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.innerText = user.name;
        option.style.fontWeight = 'bold';
        userSelect.appendChild(option);
    });
}

async function addTodo() {
    const newTodoTitle = newTodoInput.value;
    const userId = userSelect.value;

    if (!newTodoTitle) {
        alert('Please enter a todo title.');
        return;
    }

    if (userId === 'select user') {
        alert('Please select a user.');
        return;
    }

    const newTodo = {
        title: newTodoTitle,
        completed: false,
        userId: parseInt(userId)
    };

    try {
        const response = await fetch('http://31.129.109.51/api/todos', {
            method: 'POST',
            body: JSON.stringify(newTodo),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        const data = await response.json();
        todos.push(data);
        renderTodos();
        newTodoInput.value = '';
    } catch (error) {
        alert( 'Error adding todo: ' + error);
    }
}

async function toggleTodoStatus(todoId) {
    const todo = todos.find(todo => todo.id === todoId);
    todo.completed = !todo.completed;

    try {
        await fetch(`http://31.129.109.51/api/todos/${todoId}`, {
            method: 'PUT',
            body: JSON.stringify(todo),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        renderTodos();
    } catch (error) {
        alert ( 'Error toggling todo status: ' + error);
    }
}

async function deleteTodo(todoId) {
    try {
        await fetch(`http://31.129.109.51/api/todos/${todoId}`, {
            method: 'DELETE',
        });

        todos = todos.filter(todo => todo.id !== todoId);
        renderTodos();
    } catch (error) {
        alert( 'Error deleting todo: ' + error);
    }
}

addButton.addEventListener('click', addTodo);

fetchData();