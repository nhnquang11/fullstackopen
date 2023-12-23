import { useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import { useEffect } from "react";
import phonebookService from "./services/phonebook";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    phonebookService.getContacts().then((contactsList) => {
      setPersons(contactsList);
    });
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addPerson = (event) => {
    event.preventDefault();

    /* Update existing contact */
    const contact = persons.find((person) => person.name === newName);
    if (contact) {
      if (
        window.confirm(
          `${contact.name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const updateInfo = {
          ...contact,
          number: newNumber,
        };
        phonebookService
          .updateContact(contact.id, updateInfo)
          .then((updatedContact) => {
            setPersons(
              persons
                .filter((person) => person.id !== contact.id)
                .concat(updatedContact)
            );
            setNewName("");
            setNewNumber("");
            setNotification({
              text: `Updated ${updatedContact.name}`,
              status: "success",
            });
            setTimeout(() => {
              setNotification(null);
            }, 3000);
          })
          .catch((error) => {
            setNotification({
              text: `Information of ${contact.name} has already been removed from server`,
              status: "fail",
            });
            setTimeout(() => {
              setNotification(null);
            }, 3000);
          });
      }
      return;
    }

    /* Add new contact */
    const newPerson = { name: newName, number: newNumber };
    phonebookService
      .addNewContact(newPerson)
      .then((newContact) => {
        setPersons(persons.concat(newContact));
        setNewName("");
        setNewNumber("");
        setNotification({
          text: `Added ${newContact.name}`,
          status: "success",
        });
        setTimeout(() => {
          setNotification(null);
        }, 3000);
      })
      .catch((error) => {
        setNotification({
          text: error.response.data.error,
          status: "fail",
        });
        setTimeout(() => {
          setNotification(null);
        }, 3000);
      });
  };

  const handleOnDelete = (event) => {
    const id = event.target.value;
    const deleteContact = persons.find((person) => person.id == id);

    if (window.confirm(`Delelte ${deleteContact.name}?`)) {
      phonebookService
        .deleteContact(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id != id));
          setNotification({
            text: `Deleted ${deleteContact.name}`,
            status: "success",
          });
          setTimeout(() => {
            setNotification(null);
          }, 3000);
        })
        .catch((error) => {
          setNotification({
            text: `Information of ${deleteContact.name} has already been removed from server`,
            status: "fail",
          });
          setTimeout(() => {
            setNotification(null);
          }, 3000);
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      {notification && <Notification config={notification} />}
      <Filter type="text" value={searchQuery} onChange={handleSearchChange} />
      <h3>add a new</h3>

      <PersonForm
        onSubmit={addPerson}
        name={newName}
        handleNameChange={handleNameChange}
        number={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} onDelete={handleOnDelete} />
    </div>
  );
};

export default App;
