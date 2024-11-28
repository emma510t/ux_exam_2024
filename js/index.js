import { fetchAPI, handleBookCard, handleAuthorCard } from "./common.js";

fetchAPI("/books?n=5", handleBookCard);
fetchAPI("/authors", handleAuthorCard, true);
// console.log("hallo");
// document.querySelector(".book_section").classList.add("remove_child");
