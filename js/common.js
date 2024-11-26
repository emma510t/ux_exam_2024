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

// function to fetch books from API and calls handleBookCard
export const fetchBooks = (endpoint) => {
  fetch(`${baseUrl}${endpoint}`)
    .then((response) => handleAPIError(response))
    .then((response) => handleBookCard(response))
    .catch(handleFetchCatchError);
};

// Creates and displays a book card and display it to a .popular_books section
const handleBookCard = function (books) {
  // Creating a section for all the books
  const bookSection = document.createElement("section");
  bookSection.className = "book_section";

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
                <img src="${bookCover}" alt="" class="book_card_img">
                <div>
                    <p class="title">${bookData.title}</p>
                    <p>${bookData.author}</p>
                </div>
                `;

          // Create an anchor element around the bookCard
          const bookCard = document.createElement("a");
          bookCard.href = "/";
          index === 4 ? (bookCard.className = "hide") : "";
          bookCard.appendChild(bookArticle);

          // Appending the bookCard to the section
          bookSection.append(bookCard);
        })
        .catch(handleFetchCatchError);
    };
    fetchBook(`/books/${bookId}`);
  });
  document.querySelector(".popular_books").append(bookSection);
};
