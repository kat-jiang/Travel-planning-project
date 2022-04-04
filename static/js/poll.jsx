// ----- component to display chart ----- //
const data = {
  labels: [
    'Red',
    'Blue',
    'Yellow'
  ],
  datasets: [{
    label: 'My First Dataset',
    data: [300, 50, 100],
    backgroundColor: [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 205, 86)'
    ],
    hoverOffset: 4
  }]
};

const config = new Chart(
  document.querySelector('#test-chart'),
  {
    type: 'doughnut',
    data: data,
  }
);


// ----- component will display the poll/chart ----- //
// state: option count (make it a dict? key option name, value option count)
// props: poll title

// display the poll, with the options, button on click for the option, get key, update the value in state, make the button disable so user cannot vote again

// to display chart, label is the key, data is the value





// ----- Parent component to store polls and charts ----- //
// state: poll_list - list of all polls

// need useeffect to fetch all the polls on initial load

// return needs to display the form and then the polls and chart

function PollContainer() {
  const [polls, setPolls] = React.useState([]);

  // function to add new poll to polls state
  function addPoll(newPoll) {
    setPolls([...polls, newPoll]);
  }

  return (
    <React.Fragment>
      <div className="row">
        <CreatePollForm addPoll={addPoll} />
      </div>
      <div className="row">
        <div className="col-md-6">
        </div>
        <div className="col-md-3">
          <canvas id="test-chart"></canvas>
        </div>
      </div>
    </React.Fragment>
  );
}





// ----- component to display form and take inputs ----- //

function CreatePollForm(props) {
  // states?
  const [title, setTitle] = React.useState("");
  const [options, setOptions] = React.useState([]);
  const [option, setOption] = React.useState("");

  // function to add options into state
  function addOption() {
    setOptions([...options, option]);
    setOption("");
  }
  // takes form inputs, send to backend, returns new poll
  function createPoll() {
    const tripId = document.querySelector('#trip_id').value;

    fetch("/create-poll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ options: options, title: title, tripId: tripId }),
    }).then((response) => { response.json()
      .then((jsonResponse) => {
        props.addPoll(jsonResponse.poll)
      });
    });
  }

  // prevent submission of form
  function handleSubmit (event) {
    event.preventDefault();
  }

  // return form, make sure to add event handlers to update state
  return (
    <React.Fragment>
      <h2>Create a Poll</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="titleInput">Poll Title: </label>
        <input
          id="titleInput"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required></input>
        <label htmlFor="optionInput">Option </label>
        <input
          id="optionInput"
          type="text"
          value={option}
          onChange={(event) => setOption(event.target.value)}
          ></input>
        <button onClick={addOption}> Add more options </button>
        {options}
      </form>
      <button onClick={createPoll}> Create </button>

    </React.Fragment>
  );
}

ReactDOM.render(<PollContainer />, document.querySelector('.polls'));