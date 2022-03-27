// ----- REACT FILE TO RENDER TASK-LIST ----- //

// ----- component to create task html ----- //
function TaskItem(props) {
  return (
    <li className="task">
        {props.assignedUser}
        {props.taskItem}
        {props.completed}
    </li>
  );
}

// ----- Parent component to store tasks and users ----- //
function TaskListContainer() {

  const [tasks, setTasks] = React.useState([]);
  const [users, setUsers] = React.useState([]);

  function addTaskItem(newTaskItem) {
    setTasks([...tasks, newTaskItem]);
  }
  const tripId = document.querySelector('#trip_id').value;

  // fetch trip tasks from backend to render on initial load
  React.useEffect(() => {
    fetch(`/tasks.json?tripId=${tripId}`)
    .then((response) => response.json())
    .then((data) => {
      setTasks(data.tasks);
      setUsers(data.users);
    })
  }, [])

  // grab all tasks and create html
  const taskList = [];

  for (const task of tasks) {
    taskList.push(
      <TaskItem
        key={task.task_id}
        assignedUser={task.assigned_user}
        taskItem={task.task_item}
        completed={task.completed}
      />,
    );
  }

  // return form component with props/render the new tasks
  return (
    <React.Fragment>
      <AddNewTaskForm addTaskItem={addTaskItem} users={users} />
      <h2>Task List</h2>
      <div className="grid">{taskList}</div>
    </React.Fragment>
  );
}

// ----- component to display form and take inputs ----- //
function AddNewTaskForm(props) {
  const [assignedUser, setAssignedUser] = React.useState("");
  const [task, setTask] = React.useState("");

  // takes form inputs, send to backend, returns new task
  function addNewTaskItem() {
    if (task !== "" && assignedUser !== "") {
      const tripId = document.querySelector('#trip_id').value;

      fetch("/add-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assignedUser: assignedUser, task: task, tripId: tripId }),
      }).then((response) => { response.json()
        .then((jsonResponse) => {
          props.addTaskItem(jsonResponse.taskAdded);
        });
      });
    };
  }
  // grab all trip users and create html
  const userList = [];

  for (const user of props.users) {
    userList.push(
    <option key={user.user_id} value={user.user_id}>{user.fname} {user.lname}</option>)
  };
  // return form, make sure to add event handlers to update state
  return (
    <React.Fragment>
      <h2>Add A New Task</h2>
      <form>
        <label htmlFor="taskInput">Create a new task: </label>
        <input id="taskInput"
          value={task}
          onChange={(event) => setTask(event.target.value)} required></input>
        <label htmlFor="nameInput">Assign to: </label>
        <select className="form-select" defaultValue="" onChange={(event) => setAssignedUser(event.target.value)} required>
          <option value="" disabled>Assign to:</option>
          {userList}
        </select>
        <button onClick={addNewTaskItem}> Add </button>
      </form>
    </React.Fragment>
  );
}


ReactDOM.render(<TaskListContainer />, document.querySelector('.task-list'));