import { fetchAPI, handleBookCard, handleAuthorCard } from "./common.js";

fetchAPI("/books?n=5", handleBookCard, { page: "index" });
fetchAPI("/authors", handleAuthorCard, true);
