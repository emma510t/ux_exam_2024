import { baseUrl, handleAPIError, handleFetchCatchError } from "./common.js";

// function to fetch data from API
const fetchData = (endpoint) => {
  fetch(`${baseUrl}${endpoint}`)
    .then((response) => handleAPIError(response))
    .then((response) => showData(response))
    .catch(handleFetchCatchError);
};

function showData(response) {
  console.log(response);
}

fetchData("/authors");
