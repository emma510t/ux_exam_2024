import { fetchAPI, handleBookCard } from "./common.js";

fetchAPI("/books?n=15", handleBookCard, { page: "discover" });

document.querySelector(".discover_more").addEventListener("click", () => {
  document.querySelector(".popular_books").innerHTML = "";
  document.querySelector(".popular_books").classList.add("hide");
  document.querySelector(".loading_section").classList.remove("hide");
  fetchAPI("/books?n=15", handleBookCard, { page: "discover" });
});
