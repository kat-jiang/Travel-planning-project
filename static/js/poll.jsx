"use strict";

// ----- component will display the poll/chart ----- //
// state: option count (make it a dict? key option name, value option count)
// props: poll title

// display the poll, with the options, button on click for the option, get key, update the value in state, make the button disable so user cannot vote again

// to display chart, label is the key, data is the value

function PollOptions(props) {
  // state: {option_name:user_count}
  const [options, setOptions] = React.useState([]);
  const chart_list = []
  console.log(chart_list)
  // fetch options from backend to render on initial load
  // need to input poll id and user id
  React.useEffect(() => {
    fetch(`/options.json?pollId=${props.pollId}`)
    .then((response) => response.json())
    .then((data) => {
      setOptions(data.options);
      renderChart(data.options)
    })
  }, [])

  function renderChart(options) {
    const label_list = [];
    const data_list = [];

    for (const option of options) {
      label_list.push(option.option_name)
      data_list.push(option.votes)
    }

    const data = {
      labels: label_list,
      datasets: [{
        label: 'My First Dataset',
        data: data_list,
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
      }]
    };
    const config ={
        type: 'doughnut',
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: `${props.pollTitle}`,
            }
          }
        },
      }
    const grapharea = document.querySelector(`#chart-${props.pollId}`);
    const chart = new Chart(grapharea, config);
    chart_list.push(chart)
  }

  function addVote(optionId) {
    // need user id, option
    fetch("/add-vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ optionId: optionId, pollId: props.pollId }),
    })
    .then((response) => response.json())
    .then((jsonResponse) => {
      setOptions(jsonResponse.options);
      chart_list[0].destroy();
      renderChart(jsonResponse.options);
    });
  }

  const options_list = []
  for (const option of options) {
    options_list.push(
      <li
      className="list-group-item"
      key={option.option_id}
      value={option.option_id}
      onClick={(event) => addVote(event.target.value)}
      >{option.option_name}</li>
    )
  }


  return (
    <div className="row">
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            {props.pollTitle}
          </div>
          <ul className="list-group list-group-flush">
            {options_list}
          </ul>
        </div>
      </div>
      <div className="col-md-3">
        <canvas id={`chart-${props.pollId}`}>
        </canvas>
      </div>
    </div>

  );
}




// ----- Parent component to store polls and charts ----- //
// state: poll_list - list of all polls

// need useeffect to fetch all the polls on initial load

// return needs to display the form and then the polls and chart

function PollContainer() {
  // state: poll_list - list of all polls
  const [polls, setPolls] = React.useState([]);

  // tripid
  const tripId = document.querySelector('#trip_id').value;

  // function to add new poll to polls state
  function addPoll(newPoll) {
    setPolls([...polls, newPoll]);
  }

  // fetch polls/options from backend to render on initial load
  React.useEffect(() => {
    fetch(`/polls.json?tripId=${tripId}`)
    .then((response) => response.json())
    .then((data) => {
      setPolls(data.polls);
    })
  }, [])
  const polls_list = [];
  for (const poll of polls) {
    polls_list.push(
      <PollOptions
        key={poll.poll_id}
        pollId={poll.poll_id}
        pollTitle={poll.poll_title}
      />
    )
  }

  return (
    <React.Fragment>
      <div className="row">
        <CreatePollForm addPoll={addPoll} />
      </div>
      {polls_list}
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