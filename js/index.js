import { fetchAPI, handleBookCard, handleAuthorCard } from "./common.js";

fetchAPI("/books?n=5", ".popular_books", handleBookCard, { page: "index" });
fetchAPI("/authors", ".authors_selection", handleAuthorCard, true);
