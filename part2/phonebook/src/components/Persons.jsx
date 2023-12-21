const Persons = ({ persons, onDelete }) => {
  return (
    <div>
      {persons.map((person) => (
        <p key={person.id}>
          {person.name} {person.number}{" "}
          <button value={person.id} onClick={onDelete}>
            delete
          </button>
        </p>
      ))}
    </div>
  );
};

export default Persons;
