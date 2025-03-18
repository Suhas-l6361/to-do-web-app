index.html: The frontend of the app. Contains the structure and UI for the To-Do list.

style.css: CSS styles for the frontend of the app.

script.js: JavaScript to handle the functionality for Elements

taskRoutes.js: Express routes for interacting with tasks in the MongoDB database

server.js: Sets up the Express server, connects to MongoDB.

.env: Contains environment variables like the MongoDB connection string and the server port.

Install Dependencies
npm install
npm init

Set Up MongoDB
mongoose

Configure Environment Variables
PORT=8000
MONGO_URL="mongodb://localhost:27017/crud"

Installed necessary dependencies like express, body-parser, dotenv...


addTaskButton :- allows users to add a new task
<button id="addTaskButton">Add Task</button>
When clicked, the addTask() function is triggered in the script.js file.
POST request to the backend at /api/tasks.


<button id="getTasksButton">Get Tasks</button>
Get Tasks button allows users to retrieve all tasks from the backend.
fetchTasksTable() function is triggered in script.js.
It sends a GET request to the backend at /api/tasks to retrieve all tasks.

<button>Update</button>
The Update button allows users to edit the text of a task.
updateTask() function is triggered in script.js.
sending a PUT request to the backend.

<button>Delete</button>
Delete button allows users to remove a task from the list.
the deleteTask() function is triggered in script.js.
sends a DELETE request to the backend.

toggleTaskCompletion()
toggle the completed status of the task.
