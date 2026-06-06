import axios from "axios";
const registerUser = async (formData) => {
  const response = await axios.post("http://localhost:5000/signup", formData);
  return response.data;
};

const loginUser = async (credentials) => {
  const response = await axios.post("http://localhost:5000/login", credentials);
  return response.data;
};

export { registerUser, loginUser };