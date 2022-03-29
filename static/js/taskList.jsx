// ----- REACT FILE TO RENDER TASK-LIST ----- //

// ----- component to create task html ----- //
function TaskItem(props) {
  // make completed a state and not prop
  const [completed, setCompleted] = React.useState(props.completed);

  let completeness = "not complete";
  if (completed) {completeness = "completed"};

  // call function which takes task_id, sends fetch to backend to update db, return task item, and call function to setstate
  function taskCompleted() {
    fetch("/task-complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskId: props.taskId, completed: !completed }),
    })
    .then((response) => response.json())
    .then((jsonResponse) => {
      setCompleted(jsonResponse.task.completed);
    });
  }

  // function to delete task from task list
  function deleteTask() {
    fetch("/delete-task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskId: props.taskId}),
    })
    .then((response) => response.json())
    .then((jsonResponse) => {
      props.updateTaskList(jsonResponse.tasks);
    });
  }

  return (
    <div className="task">
        {props.assignedUser}//
        {props.taskItem}//
        <button onClick={taskCompleted}
        >{completeness}</button>
        <button onClick={deleteTask}
        >Delete</button>
    </div>
  );
}

// ----- Parent component to store tasks and users ----- //
function TaskListContainer() {
  // make tasks and users a state
  const [tasks, setTasks] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  // tripid
  const tripId = document.querySelector('#trip_id').value;

  // function to add new task item to tasks state
  function addTask(newTask) {
    setTasks([...tasks, newTask]);
  }
  function updateTaskList(updatedTasks) {
    setTasks(updatedTasks);
  }

  // fetch trip tasks from backend to render on initial load
  React.useEffect(() => {
    fetch(`/tasks.json?tripId=${tripId}`)
    .then((response) => response.json())
    .then((data) => {
      setTasks(data.tasks);
      setUsers(data.users);
    })
  }, [])

  // grab all tasks and create html - call TaskItem component
  const taskList = [];
  for (const task of tasks) {
    taskList.push(
      <TaskItem
        key={task.task_id}
        taskId={task.task_id}
        assignedUser={task.assigned_user}
        taskItem={task.task_item}
        completed={task.completed}
        updateTaskList={updateTaskList}
      />,
    );
  }

  // return form component with props/render the new tasks
  return (
    <React.Fragment>
      <AddNewTaskForm addTask={addTask} users={users} />
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
  function addNewTask() {
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
          props.addTask(jsonResponse.taskAdded);
        });
      });
    };
  }
  // prevent submission of form
  function handleSubmit (event) {
    event.preventDefault();
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
      <form onSubmit={handleSubmit}>
        <label htmlFor="taskInput">Create a new task: </label>
        <input
          id="taskInput"
          value={task}
          onChange={(event) => setTask(event.target.value)}
          required></input>
        <label htmlFor="nameInput">Assign to: </label>
        <select
          className="form-select"
          defaultValue=""
          onChange={(event) => setAssignedUser(event.target.value)}
          required>
          <option value="" disabled>Assign to:</option>
          {userList}
        </select>
        <button onClick={addNewTask}> Add </button>
      </form>
    </React.Fragment>
  );
}


ReactDOM.render(<TaskListContainer />, document.querySelector('.task-list'));