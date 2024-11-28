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
export const handleBookCard = function (books) {
  // Creating a container for all the books
  const bookContainer = document.createElement("section");
  bookContainer.className = "book_section";

  books.forEach((book, index) => {
    // Getting the book id
    const bookId = book["book_id"];

    //Fetching all the needed data for the book (also the cover)
    const fetchBook = (endpoint) => {
      fetch(`${baseUrl}${endpoint}`)
        .then((response) => handleAPIError(response))
        .then((bookData) => {
          console.log(bookData);
          // Create an article for the book
          const bookArticle = document.createElement("article");
          bookArticle.className = "book_card";
          // Handling image if extern API fails
          const bookCover = bookData.cover !== "" ? bookData.cover : "/assets/images/book_placeholder.jpg";
          // Building the bookArticle
          bookArticle.innerHTML = `
                <div class="book_image_container">
                  <img src="${bookCover}" alt="" class="book_card_img">
                </div>
                <div class="text_container">
                    <p class="title">${bookData.title}</p>
                    <p>${bookData.author}</p>
                </div>
                `;

          // Create an anchor element around the bookCard
          const bookCard = document.createElement("a");
          bookCard.href = `/book?id=${bookId}`;
          index === 4 ? (bookCard.className = "hide") : "";
          bookCard.appendChild(bookArticle);

          // Appending the bookCard to the container
          bookContainer.append(bookCard);
        })
        .catch(handleFetchCatchError);
    };
    fetchBook(`/books/${bookId}`);
  });

  // appending to DOM
  document.querySelector(".popular_books").append(bookContainer);
};

// Creates and displays a author card and display it to a .popular_authors section
export const handleAuthorCard = function (authors, limit) {
  const authorArray = limit ? authors.slice(0, 10) : authors;

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

    // Create an anchor element around the authorCard
    const authorCard = document.createElement("a");
    // set eventlistener to set seesionStorage to storage the authors id for further use
    authorCard.addEventListener("click", () => {
      sessionStorage.setItem("author", authorId);
    });
    authorCard.href = `/author.html?${author.author_name}`;
    authorCard.appendChild(authorArticle);

    // Appending the authorCard to the container
    authorContainer.append(authorCard);
  });

  // appending to DOM
  document.querySelector(".popular_authors").append(authorContainer);
};
