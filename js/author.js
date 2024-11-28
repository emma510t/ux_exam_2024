import { fetchAPI, handleBookCard } from "./common.js";

console.log("hello");
const urlParams = new URLSearchParams(window.location.search);
const authorId = urlParams.get("id");
console.log(authorId);

fetchAPI(`/books?a=${authorId}`, handleBookCard);
