export const baseUrl = "http://localhost:8080";

// Handles the first .then() in a fetch request, raising an error if the response code is not a 2xx
export const handleAPIError = (response) => {
  if (response.ok) {
    return response.json();
  }
  throw new Error("HTTP response error");
};

// Handles an error in a fetch request's .catch(), displaying an error message on the page
export const handleFetchCatchError = (error) => {
  const errorSection = document.createElement("section");
  errorSection.innerHTML = `
        <h4>    
            <h3>Data Error</h3>
        </h4>
        <p>An error occurred while getting the data</p>
        <p class="error">${error}</p>
    `;
  document.querySelector("main").append(errorSection);
};

// function to fetch from API and calls a function with parameter if needed
export const fetchAPI = (endpoint, func_name, parameter) => {
  fetch(`${baseUrl}${endpoint}`)
    .then((response) => handleAPIError(response))
    .then((response) => func_name(response, parameter))
    .catch(handleFetchCatchError);
};

// Creates and displays a book card and display it to a .popular_books section
export const handleBookCard = function (books, page) {
  // Creating a container for all the books
  const bookContainer = document.createElement("section");
  bookContainer.className = "book_section";

  // Array to hold all fetch promises
  const fetchBook = books.map((book, index) => {
    // Getting the book id
    const bookId = book["book_id"];

    // Fetching all the needed data for the book (also the cover)
    return fetch(`${baseUrl}/books/${bookId}`)
      .then((response) => handleAPIError(response))
      .then((bookData) => {
        // Create an article for the book
        const bookArticle = document.createElement("article");
        bookArticle.className = "book_card";

        // Handling image if extern API fails
        const bookCover = bookData.cover !== "" ? bookData.cover : "/assets/images/book_placeholder.jpg";

        const subtitle =
          page === "index"
            ? `<p>${bookData.author}</p>`
            : '<p>About the book <span><svg width="11" height="18" viewBox="0 0 11 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="svg"> <path d="M2 2L9 9" stroke-width="4" stroke-linecap="round" /> <path d="M2 16L9 9" stroke-width="4" stroke-linecap="round" /></svg></span></p>';

        // Building the bookArticle
        bookArticle.innerHTML = `
              <div class="book_image_container">
                <img src="${bookCover}" alt="" class="book_card_img">
              </div>
              <div class="text_container">
                  <p class="title">${bookData.title}</p>
                  ${subtitle}
              </div>
              `;

        // Create an anchor element around the bookCard
        const bookCard = document.createElement("a");
        bookCard.href = `/book?id=${bookId}`;

        // If its the index page, then the fifth book will have special class
        if (page === "index") {
          index === 4 ? (bookCard.className = "fifth_book") : "";
        }
        bookCard.appendChild(bookArticle);

        // Appending the bookCard to the container
        bookContainer.append(bookCard);
      })
      .catch(handleFetchCatchError);
  });

  // Check if there are fewer than three books fetched on the author site
  // if (page === "author" && books.length < 3) {
  //   // Wait for all fetch promises to resolve before creating fakebooks
  //   Promise.all(fetchBook)
  //     .then(() => {
  //       const fakeBooks = makeFakeBooks();

  //       fakeBooks.forEach((book) => {
  //         // Getting the book id
  //         const bookId = book["book_id"];

  //         // Create an article for the book
  //         const bookArticle = document.createElement("article");
  //         bookArticle.className = "book_card";

  //         // Handling image if extern API fails
  //         const bookCover = "/assets/images/book_placeholder.jpg";

  //         // Building the bookArticle
  //         bookArticle.innerHTML = `
  //                   <div class="book_image_container">
  //                     <img src="${bookCover}" alt="" class="book_card_img">
  //                   </div>
  //                   <div class="text_container">
  //                       <p class="title">${book.title}</p>
  //                       <p>About the book
  //                         <span>
  //                           <svg width="11" height="18" viewBox="0 0 11 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="svg">
  //                             <path d="M2 2L9 9" stroke-width="4" stroke-linecap="round" />
  //                             <path d="M2 16L9 9" stroke-width="4" stroke-linecap="round" />
  //                           </svg>
  //                         </span>
  //                       </p>
  //                   </div>
  //                   `;

  //         // Create an anchor element around the bookCard
  //         const bookCard = document.createElement("a");
  //         bookCard.href = `/book?id=${bookId}`;
  //         bookCard.appendChild(bookArticle);

  //         // Appending the bookCard to the container
  //         bookContainer.append(bookCard);
  //       });
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching books or appending fake books:", error);
  //     });
  // }
  // Appending the container to the DOM
  document.querySelector(".popular_books").append(bookContainer);
};

// Creates and displays a author card and display it to a .popular_authors section
export const handleAuthorCard = function (authors, limit) {
  const authorArray = limit ? getRandomAuthors(authors, 10) : authors;

  // Creating a section for all the authors
  const authorContainer = document.createElement("section");
  authorContainer.className = "author_section";

  authorArray.forEach((author) => {
    const authorId = author["author_id"];
    console.log(authorId);
    // Create an article for the author
    const authorArticle = document.createElement("article");
    authorArticle.className = "author_card";

    authorArticle.innerHTML = `
    <p class="title">${author.author_name}</p>
    <p>
      See their books
      <span>
        <svg width="11" height="18" viewBox="0 0 11 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="author_svg">
          <path d="M2 2L9 9" stroke-width="4" stroke-linecap="round" />
          <path d="M2 16L9 9" stroke-width="4" stroke-linecap="round" />
        </svg>
      </span>
    </p>
    `;

    // Create an anchor element around the authorCard, and set href to send the id and author name
    const authorNameURL = author.author_name.replaceAll(" ", "-");
    const authorCard = document.createElement("a");
    authorCard.href = `/author.html?id=${authorId}&author=${authorNameURL}`;
    authorCard.appendChild(authorArticle);

    // Appending the authorCard to the container
    authorContainer.append(authorCard);
  });

  // appending to DOM
  document.querySelector(".popular_authors").append(authorContainer);
};

function getRandomAuthors(array, count) {
  const result = [];
  const usedIndices = new Set();

  while (result.length < count && result.length < array.length) {
    const randomIndex = Math.floor(Math.random() * array.length);
    if (!usedIndices.has(randomIndex)) {
      usedIndices.add(randomIndex);
      result.push(array[randomIndex]);
    }
  }

  return result;
}

function makeFakeBooks() {
  const fakeBooks = [
    { book_id: 1005, title: "The book of mystery", publishing_year: 1911, author: "The ghost", publishing_company: "Labadie-Zboncak" },
    { book_id: 1005, title: "The book of mystery", publishing_year: 1911, author: "The ghost", publishing_company: "Labadie-Zboncak" },
    { book_id: 1005, title: "The book of mystery", publishing_year: 1911, author: "The ghost", publishing_company: "Labadie-Zboncak" },
    { book_id: 1005, title: "The book of mystery", publishing_year: 1911, author: "The ghost", publishing_company: "Labadie-Zboncak" },
  ];
  return fakeBooks;
}
