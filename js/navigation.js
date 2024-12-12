import { loggedInUserID, logout } from "./common.js";

document.querySelector("#search").addEventListener("input", (e) => {
  const resetButton = document.querySelector(".search-box_reset");
  if (e.target.value.length > 0) {
    resetButton.classList.remove("hidden");
  } else {
    resetButton.classList.add("hidden");
  }
});

document.querySelector(".search-box_reset").addEventListener("click", () => {
  document.querySelector("#search").value = "";
  document.querySelector(".search-box_reset").classList.add("hidden");
});

document.querySelector(".search-box").addEventListener("submit", (e) => {
  e.preventDefault();
  const search_text = e.target.search.value.trim().replaceAll(" ", "-");
  window.location.href = `http://127.0.0.1:5500/searchresult.html?search=${search_text}`;
});

if (loggedInUserID()) {
  document.querySelector("li:has(#login-link)").classList.add("hidden");
  document.querySelector("li:has(#signup-link)").classList.add("hidden");
  document.querySelector("li:has(#logout-btn)").classList.remove("hidden");
  if (loggedInUserID() == 2679) {
    document.querySelector("li:has(#admin-link)").classList.remove("hidden");
    document.querySelector("li:has(#profile-link)").classList.add("hidden");
  } else {
    document.querySelector("li:has(#profile-link)").classList.remove("hidden");
    document.querySelector("li:has(#admin-link)").classList.add("hidden");
  }
} else {
  document.querySelector("li:has(#login-link)").classList.remove("hidden");
  document.querySelector("li:has(#signup-link)").classList.remove("hidden");
  document.querySelector("li:has(#logout-btn)").classList.add("hidden");

  document.querySelector("li:has(#profile-link)").classList.add("hidden");
  document.querySelector("li:has(#admin-link)").classList.add("hidden");
}

document.querySelector("#logout-btn").addEventListener("click", () => logout());
