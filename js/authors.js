import { fetchAPI, handleAuthorCard } from "./common.js";

fetchAPI("/authors", showAuthors);

function showAuthors(authors) {
  console.log(authors);
  filterAuthors(authors, "a");
  const buttons = document.querySelector(".filter_section").getElementsByTagName("button");
  for (const btn of buttons) {
    //console.log(btn.value);
    btn.addEventListener("click", () => {
      //   const old_chosen_btn = document.querySelector(".chosen_btn");
      //   old_chosen_btn ? old_chosen_btn.classList.remove("chosen_btn") : "";
      document.querySelector(".chosen_btn").classList.remove("chosen_btn");
      btn.classList.add("chosen_btn");
      filterAuthors(authors, btn.value);
    });
  }
  const dropdown = document.querySelector("#dropdown");
  dropdown.addEventListener("change", (e) => {
    filterAuthors(authors, e.target.value);
  });
  //const authorWithA = allAuthors.filter((author) => author.author_name.startsWith("a"));
  //handleAuthorCard(authors)
}

// filter authors according to letter of last name (or first if author only has one name)
function filterAuthors(authors, letter) {
  document.querySelector(".popular_authors").innerHTML = "";
  const filteredArray = authors.filter((item) => {
    let name = item.author_name; // Get the author_name
    if (!name.includes(" ")) {
      // No space, check if the name starts with a/A
      return name[0].toLowerCase() === letter;
    } else {
      // Has spaces, check the last name after the last space
      let lastName = name.split(" ").pop(); // Get the last part
      return lastName[0].toLowerCase() === letter;
    }
  });
  // Sort the filtered array to be alpabeatic
  filteredArray.sort((a, b) => {
    // Get the last name (or first if there's no space) for both objects
    let lastNameA = a.author_name.split(" ").pop().toLowerCase();
    let lastNameB = b.author_name.split(" ").pop().toLowerCase();

    // Compare the last names
    if (lastNameA < lastNameB) return -1; // a comes before b
    if (lastNameA > lastNameB) return 1; // b comes before a
    return 0; // they are equal
  });
  if (filteredArray.length < 1) {
    document.querySelector(".popular_authors").innerHTML = `<p>No authors starting with "${letter}", sadly</p>`;
  } else {
    handleAuthorCard(filteredArray);
  }
}

// make image fixed to the left and the rest scrollable
