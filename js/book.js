import { fetchAPI, loggedInUserID, baseUrl, createToast } from "./common.js";

const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get("id");
const user_id = loggedInUserID();

let loan_information = "";
let loan_history = "";

// fetch book info according to who the user is
if (loggedInUserID() == 2679) {
  fetchAPI(`/admin/books/${bookId}`, "main", showBook);
} else {
  fetchAPI(`/books/${bookId}`, "main", showBook);
}

function showBook(book) {
  document.title = `BOOKS4U | ${book.title}`;

  if (loggedInUserID() && loggedInUserID() != 2679) {
    loan_information = '<section id="loan_information"><button id="loan_btn">Loan the book</button></section>';
  }

  // If admin is logged in and loans key is present
  if (book["loans"]) {
    loan_history = '<section id="loan_info_container"><h3>Loan history</h3>';

    book["loans"].forEach((loan) => {
      const loan_section = `<article class="loan_info"><h4>Loan date</h4><p class="info_text">${loan.loan_date}</p><h4>User id</h4><p class="info_text">${loan.user_id}</p></article>`;
      loan_history = loan_history + loan_section;
    });
    loan_history = loan_history + "</section>";
  }

  // create breadcrumbs depending on which page was the previous
  const bread_crumb = document.createElement("div");
  bread_crumb.id = "bread_crumbs";
  const authorNameURL = book.author.replaceAll(" ", "-");
  if (urlParams.get("author")) {
    const authorId = urlParams.get("author");
    bread_crumb.innerHTML = `
          <a href="authors.html">Authors</a>
          <svg id="bread_crumb_divider" width="11" height="18" viewBox="0 0 11 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2L9 9" stroke-linecap="round" />
            <path d="M2 16L9 9" stroke-linecap="round" />
          </svg>
          <a id="bread_current_author" href="author.html?id=${authorId}&author=${authorNameURL}" >${book.author}</a>
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
          ${loan_information}
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

  // Eventlistener for the loan button (if present)
  const loan_btn = document.querySelector("#loan_btn");
  if (loan_btn) {
    loan_btn.addEventListener("click", () => {
      checkUserLoan();
    });
  }

  setTimeout(() => {
    document.querySelector(".loading_section").classList.add("hide");
    book_section.classList.add("appear");
    bread_crumb_container.classList.add("appear");
    book_section.classList.remove("hide");
    bread_crumb_container.classList.remove("hide");
  }, 1000); // a timeout for hiding the loader and make the book_section appear
}

function checkUserLoan() {
  fetch(`${baseUrl}/users/${user_id}/books/${bookId}`, {
    method: "POST",
  })
    .then((response) => {
      // If loan is succesful
      if (response.ok) {
        return response.json();
      }
      // If the response is not OK, try to extract the error message from the response body
      return response.json().then((errorDetails) => {
        throw new Error(errorDetails.error || "HTTP response error"); // Fallback to a generic error message if no specific message exists
      });
    })
    .then((response) => {
      const loan_text = document.createElement("p");
      loan_text.id = "loan_text";
      loan_text.innerText = "Book loaned. Check your email for the access link - Enjoy!";
      document.querySelector("#loan_information").append(loan_text);
      document.querySelector("#loan_btn").disabled = true;
      console.log("book loaned", response);
    })
    .catch((error) => {
      // If user already have a loan
      if (error == "Error: This user has still this book on loan") {
        const loan_text = document.createElement("p");
        loan_text.id = "loan_text";
        loan_text.innerText = "You already have a loan on this book. Check your email for the access link - Enjoy!";
        document.querySelector("#loan_information").append(loan_text);
        document.querySelector("#loan_btn").disabled = true;
        console.log("book loaned");
      } else {
        console.log("Failed to fetch loan information", error);
        createToast("Failed to fetch loan information. Please come back later", "negative");
      }
    });
}
