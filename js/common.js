const baseUrl = "http://localhost:8080";

// Handles the first .then() in a fetch request, raising an error if the response code is not a 2xx
const handleAPIError = (response) => {
  if (response.ok) {
    return response.json();
  }
  // If the response is not OK, try to extract the error message from the response body
  return response.json().then((errorDetails) => {
    throw new Error(errorDetails.error || "HTTP response error"); // Fallback to a generic error message if no specific message exists
  });
};

// Handles an error in a fetch request's .catch(), displaying an error message on the page
export const handleFetchCatchError = (error, method, func_name, errorDestination) => {
  if (method === "GET") {
    console.log(error);
    const errorSection = document.createElement("section");
    errorSection.innerHTML = `
    <h4>    
    <h3>Data Error</h3>
    </h4>
    <p>An error occurred while retrieving the data. Please come back later.</p>
    `;
    // if page has loader, then hide it
    if (document.querySelector(".loading_section")) {
      document.querySelector(".loading_section").classList.add("hide");
    }

    if (func_name.name === "handleBookCard") {
      document.querySelector(errorDestination).classList.remove("hide");
      document.querySelector(errorDestination).append(errorSection);
    } else if (func_name.name === "handleAuthorCard" || func_name.name === "showAuthors") {
      document.querySelector(errorDestination).classList.remove("hide");
      document.querySelector(errorDestination).append(errorSection);
    } else {
      document.querySelector(errorDestination).append(errorSection);
    }
  } else {
    createToast(error, "negative");
  }
};

// function to fetch from API and calls a function with parameter if needed
export const fetchAPI = (endpoint, errorDestination, func_name, parameter, options = {}) => {
  const method = options.method || "GET";
  fetch(`${baseUrl}${endpoint}`, options)
    .then((response) => handleAPIError(response))
    .then((response) => func_name(response, parameter))
    .catch((error) => handleFetchCatchError(error, method, func_name, errorDestination));
};

// Creates and displays a book card and display it to a .popular_books section
export const handleBookCard = function (books, page) {
  // Creating a container for all the books
  const bookContainer = document.createElement("section");
  bookContainer.className = "book_section";

  // looping over all the books
  books.forEach((book, index) => {
    // Getting the book id
    const bookId = book["book_id"];

    // Fetching all the needed data for the book (also the cover)
    fetch(`${baseUrl}/books/${bookId}`)
      .then((response) => handleAPIError(response))
      .then((bookData) => {
        // Create an article for the book
        const bookArticle = document.createElement("article");
        bookArticle.className = "book_card";

        // Handling image if extern API fails
        const bookCover = bookData.cover !== "" ? bookData.cover : "/assets/images/book_placeholder.jpg";

        const subtitle =
          page === "index" || page === "discover"
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

  // Appending the container to the DOM and hiding the loader
  const popular_books = document.querySelector(".popular_books");
  popular_books.append(bookContainer);

  setTimeout(() => {
    popular_books.classList.add("appear");
    popular_books.classList.remove("hide");
    document.querySelector(".discover_more") ? document.querySelector(".discover_more").classList.remove("hide") : "";
    document.querySelector(".loading_section").classList.add("hide");
  }, 1000); // a timeout for hiding the loader and make the popular_books section appear
};

// Creates and displays a author card and display it to a .authors_selection section
export const handleAuthorCard = function (authors, limit) {
  const authorArray = limit ? getRandomAuthors(authors, 10) : authors;

  // Creating a section for all the authors
  const authorContainer = document.createElement("section");
  authorContainer.className = "author_section";

  authorArray.forEach((author) => {
    const authorId = author["author_id"];
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
  document.querySelector(".authors_selection").append(authorContainer);
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

function createToast(message, type) {
  // Get the toast container or create one if it doesn't exist
  let toastContainer = document.querySelector(".toast-container");

  // Generate a unique ID for accessibility attributes
  const toastId = `toast-${Date.now()}`;

  // Create the toast element
  const toast = document.createElement("div");
  toast.classList.add("toast");

  // Add ARIA and accessibility attributes
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-describedby", `${toastId}-description`);

  // Add the type-specific class
  if (type === "negative") {
    toast.classList.add("negative");
  } else if (type === "positive") {
    toast.classList.add("positive");
  }

  // Set the toast content
  toast.innerHTML = `
    <p id="${toastId}-description">${message}</p>
    <button class="close-toast" aria-label="Close this notification"><span class="icon-close">Close</span></button>
  `;

  // Add close functionality
  toast.querySelector(".close-toast").addEventListener("click", () => {
    toast.remove();
  });

  // Add the toast to the container
  toastContainer.appendChild(toast);

  // Auto remove the toast after 5 seconds
  setTimeout(() => {
    toast.remove();
  }, 5000);
}

export const loggedInUserID = () => {
  return sessionStorage.getItem("b4u_user_id");
};

export const logout = () => {
  // remove user_id from storage
  sessionStorage.removeItem("b4u_user_id");
  window.location.replace("http://127.0.0.1:5500/login.html");
};
