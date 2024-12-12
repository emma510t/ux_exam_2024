import { fetchAPI, handleBookCard } from "./common.js";

fetchAPI("/books?n=15", ".book_selection", handleBookCard, { page: "discover" });

document.querySelector(".discover_more").addEventListener("click", () => {
  document.querySelector(".book_selection").innerHTML = "";
  document.querySelector(".book_selection").classList.add("hide");
  document.querySelector(".loading_section").classList.remove("hide");
  fetchAPI("/books?n=15", ".book_selection", handleBookCard, { page: "discover" });
});
