import { fetchAPI } from "./common.js";

const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get("id");

fetchAPI(`/books/${bookId}`, showBook);

function showBook(book) {
  document.title = `BOOKS4U | ${book.title}`;

  let bread_crumb = "";

  // create breadcrumbs
  if (urlParams.get("author")) {
    const authorId = urlParams.get("author");
    bread_crumb = `<section id="bread_crumbs">
          <a href="authors.html">Authors</a>
          <svg id="bread_crumb_divider" width="11" height="18" viewBox="0 0 11 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2L9 9" stroke-linecap="round" />
            <path d="M2 16L9 9" stroke-linecap="round" />
          </svg>
          <a id="bread_current_author" href="/author.html/id=${authorId}" >${book.author}</a>
          <svg id="bread_crumb_divider" width="11" height="18" viewBox="0 0 11 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2L9 9" stroke-linecap="round" />
            <path d="M2 16L9 9" stroke-linecap="round" />
          </svg>
          <p id="bread_current_book">${book.title}</p>
        </section>`;
  } else {
    bread_crumb = `<section id="bread_crumbs">
      <a href="discoverbooks.html">Discover books</a>
      <svg id="bread_crumb_divider" width="11" height="18" viewBox="0 0 11 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 2L9 9" stroke-linecap="round" />
        <path d="M2 16L9 9" stroke-linecap="round" />
      </svg>
      <p id="bread_current_book">${book.title}</p>
    </section>`;
  }

  const book_section = document.querySelector(".book_singleview");
  // add all information inside

  const loan_btn = document.querySelector("#loan_btn");
  // display none if not user logged in or if user is admin
  // display if user is logged in (and not admin)
  const loan_history = document.querySelector("#loan_info");
  // display none if not logged in as admin

  //ændre src href fra author sidens bøger til også at sende author id
  //Søg efter author id i url.
  // //Hvis den er der - set breadcrumb til de sti.
  // //Hvis ikke: breadcrumb er discover.
  // // ændre breadcrumb ved author ???

  const book_singleview = document.createElement("div");
  book_singleview.innerHTML = `${bread_crumb}
      <article id="book_singleview">
        <div>
          <h2>Book title</h2>
          <p id="author_name">${book.author}</p>
          <button id="loan_btn" class="hide">Loan the book</button>
          <section id="publisher_info" class="info_box">
            <div>
              <p>Publishing company</p>
              <p class="info_text">publisher</p>
            </div>
            <div>
              <p>Publishing year</p>
              <p class="info_text">2024</p>
            </div>
          </section>
          <section id="loan_info" class="hide">
            <h3>Loan history</h3>
            <div class="info_box">
              <div>
                <p id="date">Date of loan</p>
                <p class="info_text" id="main">user email</p>
              </div>
            </div>
          </section>
        </div>
        <img src="assets/images/book_placeholder.jpg" alt="" id="book_cover" />
      </article>`;
  document.querySelector("main").appendChild(book_singleview);

  console.log(book);
}
