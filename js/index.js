import { fetchAPI, handleBookCard, handleAuthorCard } from "./common.js";

fetchAPI("/books?n=5", handleBookCard);
fetchAPI("/authors", handleAuthorCard, true);
