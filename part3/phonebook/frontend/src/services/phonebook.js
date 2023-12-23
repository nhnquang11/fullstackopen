import axios from "axios";
const baseUrl = "/api/persons";

const getContacts = async () => {
  return axios.get(baseUrl).then((response) => response.data);
};

const addNewContact = async (contact) => {
  return axios.post(baseUrl, contact).then((response) => response.data);
};

const deleteContact = async (id) => {
  return axios.delete(`${baseUrl}/${id}`).catch((error) => {
    throw error;
  });
};

const updateContact = async (id, updateInfo) => {
  return axios
    .put(`${baseUrl}/${id}`, updateInfo)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export default { getContacts, addNewContact, deleteContact, updateContact };
