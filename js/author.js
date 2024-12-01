import { fetchAPI, handleBookCard } from "./common.js";

const urlParams = new URLSearchParams(window.location.search);
const authorId = urlParams.get("id");
const authorName = urlParams.get("author").replaceAll("-", " ");

document.querySelector("#author_title").innerText = authorName;

fetchAPI(`/books?a=${authorId}`, handleBookCard, "author");
