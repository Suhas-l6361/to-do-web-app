    document.addEventListener('DOMContentLoaded', fetchTasks);
    document.getElementById('addTaskButton').addEventListener('click', addTask);
    document.getElementById('getTasksButton').addEventListener('click', fetchTasksTable);
    // document.getElementById('hideTasksButton').addEventListener('click', hideTasksTable);

    async function fetchTasks() {
        const response = await fetch('/api/tasks');
        const tasks = await response.json();
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = createTaskElement(task);
            li.id = task._id;  
            taskList.appendChild(li);
        });
    }

    async function fetchTasksTable() {
        const response = await fetch('/api/tasks');
        const tasks = await response.json();
        const taskTable = document.getElementById('taskTable');
        const taskTableBody = taskTable.querySelector('tbody');
        const noTasksMessage = document.getElementById('noTasksMessage');
        const hideTasksButton = document.getElementById('hideTasksButton');
        taskTableBody.innerHTML = '';
        if (tasks.length === 0) {
            noTasksMessage.style.display = 'block';
            taskTable.style.display = 'none';
            hideTasksButton.style.display = 'none';
        } else {
            noTasksMessage.style.display = 'none';
            taskTable.style.display = 'table';
            hideTasksButton.style.display = 'block';
            tasks.forEach(task => {
                const tr = createTaskRow(task);
                taskTableBody.appendChild(tr);
            });
        }
    }

    // function hideTasksTable() {
    //     const taskTable = document.getElementById('taskTable');
    //     const hideTasksButton = document.getElementById('hideTasksButton');
    //     taskTable.style.display = 'none';
    //     hideTasksButton.style.display = 'none';
    // }

    function createTaskElement(task) {
        const li = document.createElement('li');
        li.innerText = task.text;
        if (task.completed) {
            li.classList.add('completed');
        }
        li.addEventListener('click', () => {
            toggleTaskCompletion(task);
        });

        const updateButton = document.createElement('button');
        updateButton.innerText = 'Update';
        updateButton.addEventListener('click', () => {
            updateTask(task);
        });
        li.appendChild(updateButton);

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.addEventListener('click', () => {
            deleteTask(task._id, li);
        });
        li.appendChild(deleteButton);

        return li;
    }

    function createTaskRow(task) {
        const tr = document.createElement('tr');
        const tdText = document.createElement('td');
        tdText.innerText = task.text;
        const tdStatus = document.createElement('td');
        tdStatus.innerText = task.completed ? 'Completed' : 'Pending';
        const tdActions = document.createElement('td');

        const toggleButton = document.createElement('button');
        toggleButton.innerText = task.completed ? 'Mark as Pending' : 'Mark as Completed';
        toggleButton.addEventListener('click', () => {
            toggleTaskCompletion(task);
        });

        tdActions.appendChild(toggleButton);

        tr.appendChild(tdText);
        tr.appendChild(tdStatus);
        tr.appendChild(tdActions);

        return tr;
    }

    async function addTask() {
        const taskInput = document.getElementById('taskInput');
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: taskText })
        });
        const newTask = await response.json();
        const taskList = document.getElementById('taskList');
        const li = createTaskElement(newTask);
        li.id = newTask._id;  
        taskList.appendChild(li);
        taskInput.value = '';
    }

    async function toggleTaskCompletion(task) {
        task.completed = !task.completed;
        const response = await fetch(`/api/tasks/${task._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        });
        if (response.ok) {
            const updatedTask = await response.json();
            const li = createTaskElement(updatedTask);
            li.id = updatedTask._id;  
            document.getElementById(task._id).replaceWith(li);
            const taskTableBody = document.getElementById('taskTable').querySelector('tbody');
            taskTableBody.innerHTML = '';
            const tasks = await fetchTasksFromServer();
            tasks.forEach(task => {
                const tr = createTaskRow(task);
                taskTableBody.appendChild(tr);
            });
        } else {
            console.error('Failed to update task completion', await response.text());
        }
    }

    async function fetchTasksFromServer() {
        const response = await fetch('/api/tasks');
        return response.json();
    }

    async function updateTask(task) {
        const newText = prompt("Update task:", task.text);
        if (newText !== null && newText.trim() !== '') {
            const updatedTask = { ...task, text: newText.trim() };
            const response = await fetch(`/api/tasks/${task._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedTask)
            });
            if (response.ok) {
                const updatedTaskFromServer = await response.json();
                const li = createTaskElement(updatedTaskFromServer);
                li.id = updatedTaskFromServer._id;  
                document.getElementById(task._id).replaceWith(li);
                const taskTableBody = document.getElementById('taskTable').querySelector('tbody');
                taskTableBody.innerHTML = '';
                const tasks = await fetchTasksFromServer();
                tasks.forEach(task => {
                    const tr = createTaskRow(task);
                    taskTableBody.appendChild(tr);
                });
            } else {
                console.error('Failed to update task', await response.text());
            }
        }
    }

    async function deleteTask(id, element) {
        const response = await fetch(`/api/tasks/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            element.remove();
        } else {
            console.error('Failed to delete task', await response.text());
        }
    }
