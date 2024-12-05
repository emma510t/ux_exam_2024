import { fetchAPI, loggedInUserID } from "./common.js";

const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get("id");
let loan_btn = "";
let loan_history = "";

// if this fetch books else fetch admin books
if (loggedInUserID() == 2679) {
  fetchAPI(`/admin/books/${bookId}`, "main", showBook);
} else {
  fetchAPI(`/books/${bookId}`, "main", showBook);
}

function showBook(book) {
  document.title = `BOOKS4U | ${book.title}`;

  if (loggedInUserID() && loggedInUserID() != 2679) {
    loan_btn = '<button id="loan_btn">Loan the book</button>';
  }

  if (book["loans"]) {
    loan_history = '<section id="loan_info"><h3>Loan history</h3>';
    console.log(book["loans"]);

    book["loans"].forEach((loan) => {
      const loan_section = `<article class="loan_info"><h4>Loan date</h4><p class="info_text">${loan.loan_date}</p><h4>User id</h4><p class="info_text">${loan.user_id}</p></article>`;
      loan_history = loan_history + loan_section;
    });
    loan_history = loan_history + "</section>";
  }

  // create breadcrumbs depending on which page was the preverius
  const bread_crumb = document.createElement("div");
  bread_crumb.id = "bread_crumbs";
  if (urlParams.get("author")) {
    const authorId = urlParams.get("author");
    bread_crumb.innerHTML = `
          <a href="authors.html">Authors</a>
          <svg id="bread_crumb_divider" width="11" height="18" viewBox="0 0 11 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2L9 9" stroke-linecap="round" />
            <path d="M2 16L9 9" stroke-linecap="round" />
          </svg>
          <a id="bread_current_author" href="/author.html?id=${authorId}&author=${book.author}" >${book.author}</a>
          <svg id="bread_crumb_divider" width="11" height="18" viewBox="0 0 11 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2L9 9" stroke-linecap="round" />
            <path d="M2 16L9 9" stroke-linecap="round" />
          </svg>
          <p id="bread_current_book">${book.title}</p>`;
  } else {
    bread_crumb.innerHTML = `
      <a href="discoverbooks.html">Discover books</a>
      <svg id="bread_crumb_divider" width="11" height="18" viewBox="0 0 11 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 2L9 9" stroke-linecap="round" />
        <path d="M2 16L9 9" stroke-linecap="round" />
      </svg>
      <p id="bread_current_book">${book.title}</p>`;
  }

  const book_content = document.createElement("div");
  book_content.id = "book_view";

  // Handling image if extern API fails
  const bookCover = book.cover !== "" ? book.cover : "/assets/images/book_placeholder.jpg";

  book_content.innerHTML = `
        <div>
          <h2>${book.title}</h2>
          <p id="author_name">${book.author}</p>
          ${loan_btn}
          <section id="publisher_info" class="info_box">
            <div>
              <p>Publishing company</p>
              <p class="info_text">${book.publishing_company}</p>
            </div>
            <div>
              <p>Publishing year</p>
              <p class="info_text">${book.publishing_year}</p>
            </div>
          </section>
        ${loan_history}
        </div>
        <img src=${bookCover} alt="The cover of the book: ${book.title}" id="book_cover" />`;

  const bread_crumb_container = document.querySelector("#bread_crumb_container");
  bread_crumb_container.append(bread_crumb);
  const book_section = document.querySelector("#book_singleview");
  book_section.append(book_content);

  setTimeout(() => {
    document.querySelector(".loading_section").classList.add("hide");
    book_section.classList.add("appear");
    bread_crumb_container.classList.add("appear");
    book_section.classList.remove("hide");
    bread_crumb_container.classList.remove("hide");
  }, 1000); // a timeout for hiding the loader and make the book_section appear
}
