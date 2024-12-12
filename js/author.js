import { fetchAPI, handleBookCard } from "./common.js";

const urlParams = new URLSearchParams(window.location.search);
const authorId = urlParams.get("id");
const authorName = urlParams.get("author").replaceAll("-", " ");

document.querySelector("#author_title").innerText = authorName;
document.querySelector("#bread_current").innerText = authorName;
document.title = `BOOKS4U | ${authorName}`;

fetchAPI(`/books?a=${authorId}`, ".book_selection", handleBookCard, { page: "author", author_id: authorId });
