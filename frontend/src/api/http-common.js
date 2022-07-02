import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:8080", // TODO: update to server base url based on production environment
});