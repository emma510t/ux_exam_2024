import { fetchAPI, handleBookCard } from "./common.js";

const urlParams = new URLSearchParams(window.location.search);
const search_text = urlParams.get("search").replaceAll("-", " ");
document.querySelector("#search_result").innerText = search_text;

fetchAPI(`/books?s=${search_text}`, "main", (results) => {
  handleBookCard(results, { page: "searchresults" });

  // If there is no results
  if (results.length < 1) {
    setTimeout(() => {
      document.querySelector("#error_message") ? document.querySelector("#error_message").classList.remove("hide") : "";
    }, 1000); // a timeout for making the error message appear
  }
});
