// ----- React file for task-list ----- //

function TaskItem(props) {
  return (
    <li className="task">
        {props.assignedUser}
        {props.taskItem}
        {props.completed}
    </li>
  );
}

function TaskListContainer() {
  
  const [tasks, setTasks] = React.useState([]);
  const [users, setUsers] = React.useState([]);

  function addTaskItem(newTaskItem) {
    // const currentTasks = [...tasks];
    setTasks([...tasks, newTaskItem]);
  }
  const tripId = document.querySelector('#trip_id').value;

  React.useEffect(() => {
    fetch(`/tasks.json?tripId=${tripId}`)
    .then((response) => response.json())
    .then((data) => {
      setTasks(data.tasks);
      setUsers(data.users);
    })
  }, [])

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

  const userList = [];

  for (const user of users) {
    userList.push(
    <option key={user.user_id} value={user.user_id}>{user.fname} {user.lname}</option>)
  };

  return (
    <React.Fragment>
      <AddNewTaskForm addTaskItem={addTaskItem} userList={userList} />
      <h2>Task List</h2>
      <div className="grid">{taskList}</div>
    </React.Fragment>
  );
}

function AddNewTaskForm(props) {
  const [assignedUser, setAssignedUser] = React.useState("");
  const [task, setTask] = React.useState("");

  function addNewTaskItem() {
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
  }
  return (
    <React.Fragment>
      <h2>Add A New Task</h2>
      <label htmlFor="taskInput">Create a new task: </label>
      <input id="taskInput"
        value={task}
        onChange={(event) => setTask(event.target.value)}></input>
      <label htmlFor="nameInput">Assign to: </label>
      <select className="form-select" onChange={(event) => setAssignedUser(event.target.value)}>
        {props.userList}
      </select>
      <button onClick={addNewTaskItem}> Add </button>
    </React.Fragment>
  );
}


ReactDOM.render(<TaskListContainer />, document.querySelector('.task-list'));