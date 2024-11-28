document.querySelector("#search").addEventListener('input', (e) => {
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