import { useState } from "react";

const Heading = ({ text }) => {
  return <h1>{text}</h1>;
};

const Button = ({ text, onClick }) => {
  return <button onClick={onClick}>{text}</button>;
};

const Annecdote = ({ content, votes }) => {
  return (
    <div>
      <p>{content}</p>
      <p>has {votes} votes</p>
    </div>
  );
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));
  const [selected, setSelected] = useState(0);
  const nextSelected = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length));
  };
  const updateVotes = () => {
    let newVotes = [...votes];
    newVotes[selected]++;
    setVotes(newVotes);
  };
  const mostVotesIndex = votes.indexOf(Math.max(...votes));

  return (
    <div>
      <Heading text={"Anecdote of the day"} />
      <Annecdote content={anecdotes[selected]} votes={votes[selected]} />
      <Button text={"next annecdote"} onClick={nextSelected} />
      <Button text={"vote"} onClick={updateVotes} />
      <Heading text={"Anecdote with most votes"} />
      <Annecdote
        content={anecdotes[mostVotesIndex]}
        votes={votes[mostVotesIndex]}
      />
    </div>
  );
};

export default App;
