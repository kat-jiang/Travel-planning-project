"use strict";

// display the poll, with the options, button on click for the option, get key, update the value in state, make the button disable so user cannot vote again

// ----- component will display the poll/chart ----- //

function PollOptions(props) {
  // state: [{option_name:user_count}]
  const [options, setOptions] = React.useState([]);
  const [votedUsers, setVotedUsers] = React.useState([]);

  // fetch options from backend to render on initial load
  React.useEffect(() => {
    fetch(`/options.json?pollId=${props.pollId}`)
    .then((response) => response.json())
    .then((data) => {
      setOptions(data.options);
      setVotedUsers(data.votedUsers);
      renderChart(data.options);
    })
  }, [])

  // function to make a chart with the data
  function renderChart(optionsData) {
    const label_list = [];
    const data_list = [];

    for (const option of optionsData) {
      label_list.push(option.option_name)
      data_list.push(option.votes)
    }

    const data = {
      labels: label_list,
      datasets: [{
        label: 'Votes',
        data: data_list,
        backgroundColor: [
          '#a7cfbc',
          '#81b29a',
          '#5c9479',
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
          }
        },
      }
    const grapharea = document.querySelector(`#chart-${props.pollId}`);
    const chart = new Chart(grapharea, config);
  }

  // function to delete old chart and then make new chart with new data
  function deleteChart(optionsData) {
    // Filter all Chart instances for the instance with the canvas.id property that matches my canvas id
    const currentChart = Object.values(Chart.instances).filter((chart) => chart.canvas.id == `chart-${props.pollId}`).pop();
    // destroy the chart
    currentChart.destroy()
    // make a new chart by calling renderchart function
    renderChart(optionsData);
  }

  // function to make post request to backend to update option.users
  function addVote(optionId) {
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
      setVotedUsers(jsonResponse.votedUsers);
      deleteChart(jsonResponse.options);
    });
  }
  // function to delete poll and options
  function removePoll() {
    fetch("/remove-poll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pollId: props.pollId}),
    })
    .then((response) => response.json())
    .then((jsonResponse) => {
      props.updatePollList(jsonResponse.polls);
    });
  }

  // loop through options in list to render in poll
  // check if user voted, if so, disable click button
  const options_list = []
  for (const option of options) {
    if (option.voters.includes(currentUser)) {
      options_list.push(
      <li
      className="list-group-item voted"
      key={option.option_id}
      value={option.option_id}
      >{option.option_name} - Your Vote! - </li>
      )
    } else if (votedUsers.includes(currentUser)) {
      options_list.push(
        <li
        className="list-group-item"
        key={option.option_id}
        value={option.option_id}
        >{option.option_name}</li>
      )
    } else {
      options_list.push(
        <li
        className="list-group-item btn-vote"
        key={option.option_id}
        value={option.option_id}
        onClick={(event) => addVote(event.target.value)}
        >{option.option_name}</li>
      )
    }
  }

  return (
    <div className="row row-poll">
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            {props.pollTitle}
          </div>
          <ul className="list-group list-group-flush">
            {options_list}
          </ul>
          <button className="btn-remove"id={`remove-${props.pollId}`}
            onClick={removePoll}
          ><i className="bi bi-trash-fill"></i> Remove Poll</button>
        </div>
      </div>
      <div className="col-md-3">
        <canvas id={`chart-${props.pollId}`}>
        </canvas>
      </div>
    </div>
  );
}

// ----- Parent component to store polls---- //

function PollContainer() {
  // state: poll_list - list of all polls
  const [polls, setPolls] = React.useState([]);

  // tripid
  const tripId = document.querySelector('#trip_id').value;

  // function to add new poll to polls state
  function addPoll(newPoll) {
    setPolls([...polls, newPoll]);
  }
  // function to update polls state when a poll is removed
  function updatePollList(remainingPolls) {
    setPolls(remainingPolls);
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
        updatePollList={updatePollList}
      />
    )
  }

  return (
    <React.Fragment>
      <div className="row">
        <CreatePollForm addPoll={addPoll} />
      </div>
      <h2>Polls</h2>
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
  const pollOptions = [];
  for (const opt of options) {
    pollOptions.push(
      <span className="option-name badge rounded-pill">{opt}</span>
    )
  }

  // return form, make sure to add event handlers to update state
  return (
    <React.Fragment>
      <h2>Create a Poll</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="titleInput" hidden>Poll Title: </label>
        <input
          id="titleInput"
          className="form-input"
          placeholder="Poll title - Ask a question..."
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required></input>
        <label htmlFor="optionInput" hidden>Option </label>
        <input
          id="optionInput"
          className="form-input"
          placeholder="Poll option"
          type="text"
          value={option}
          onChange={(event) => setOption(event.target.value)}
          ></input>
        <button className="btn-add" onClick={addOption}> Add option </button>
      </form>
      <div className="poll-option-row">
        <div className="poll-options">
          {pollOptions}
        </div>
        <button className="btn-create"onClick={createPoll}> Create Poll </button>
      </div>

    </React.Fragment>
  );
}

ReactDOM.render(<PollContainer />, document.querySelector('.polls'));