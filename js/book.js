import { fetchAPI } from "./common.js";

const urlParams = new URLSearchParams(window.location.search);
const authorId = urlParams.get("id");

fetchAPI(`/books/${authorId}`, showBook);

function showBook(book) {
  document.title = `BOOKS4U | ${book.title}`;

  const book_section = document.querySelector(".book_singleview");
  const loan_btn = document.querySelector("#loan_btn");
  // display none if not user logged in or if user is admin
  // display if user is logged in (and not admin)
  const loan_history = document.querySelector("#loan_info");
  // display none if not logged in as admin

  console.log(book);
}
