import { fetchAPI, loggedInUserID } from "./common.js";

fetchAPI(`users/${loggedInUserID()}`, (response) => {
  console.log("user: ", response);
});
