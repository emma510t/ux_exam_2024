import { fetchAPI, handleBookCard, handleAuthorCard } from "./common.js";

fetchAPI("/books?n=5", ".popular_books", handleBookCard, "index");
fetchAPI("/authors", ".authors_selection", handleAuthorCard, true);
