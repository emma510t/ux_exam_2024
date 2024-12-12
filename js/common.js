export const baseUrl = "http://localhost:8080";

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
    <p class="handleFetchCatchError">Data Error</p>
    <p>An error occurred while retrieving the data. Please come back later.</p>
    `;
    // if page has loader, then hide it
    if (document.querySelector(".loading_section")) {
      document.querySelector(".loading_section").classList.add("hide");
    }

    if (func_name.name === "handleBookCard" || func_name.name === "handleAuthorCard" || func_name.name === "showAuthors") {
      document.querySelector(errorDestination).classList.remove("hide");
      document.querySelector(errorDestination).append(errorSection);
    } else if (errorDestination === "#publisherSelectContainer" || errorDestination === "#authorSelectContainer") {
      const errorSelectMessage = document.createElement("p");
      errorSelectMessage.classList.add("error-message");
      errorSelectMessage.innerText = `
    404: An error occurred while retrieving the data. Please come back later.
    `;
      document.querySelector(errorDestination).append(errorSelectMessage);
    } else {
      document.querySelector(errorDestination).append(errorSection);
    }
  } else {
    createToast(error, "negative");
  }
};

// function to fetch from API and calls a function with parameter if needed
export const fetchAPI = (endpoint, errorDestination, func_name, parameters, options = {}) => {
  const method = options.method || "GET";
  fetch(`${baseUrl}${endpoint}`, options)
    .then((response) => handleAPIError(response))
    .then((response) => func_name(response, parameters))
    .catch((error) => handleFetchCatchError(error, method, func_name, errorDestination));
};

// Creates and displays a book card and display it to a .book_selection section
export const handleBookCard = function (books, parameters) {
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
          parameters.page === "index" || parameters.page === "discover" || parameters.page === "searchresults"
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
        if (parameters.author_id !== undefined) {
          bookCard.href = `book.html?id=${bookId}&author=${parameters.author_id}`;
        } else {
          bookCard.href = `book.html?id=${bookId}`;
        }

        // If its the index page, then the fifth book will have special class
        if (parameters.page === "index") {
          index === 4 ? (bookCard.className = "fifth_book") : "";
        }
        bookCard.appendChild(bookArticle);

        // Appending the bookCard to the container
        bookContainer.append(bookCard);
      })
      .catch((error) => handleFetchCatchError(error, "GET", "handleBookCard", ".book_selection"));
  });

  // Appending the container to the DOM and hiding the loader
  const book_selection = document.querySelector(".book_selection");
  book_selection.append(bookContainer);

  setTimeout(() => {
    book_selection.classList.add("appear");
    book_selection.classList.remove("hide");
    document.querySelector(".discover_more") ? document.querySelector(".discover_more").classList.remove("hide") : "";
    document.querySelector(".loading_section").classList.add("hide");
  }, 1000); // a timeout for hiding the loader and make the book_selection section appear
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
    authorCard.href = `author.html?id=${authorId}&author=${authorNameURL}`;
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

export function createToast(message, type) {
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

export function isYoungerThan13(birthDate) {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  // Check if the birth month and day are ahead of today's month and day
  if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age < 13;
}

// Custom format: YYYY-MM-DD
export const formattedDate = () => {
  const today = new Date();
  const thirteenYearsAgo = new Date();
  thirteenYearsAgo.setFullYear(today.getFullYear() - 13);
  return thirteenYearsAgo.toISOString().split("T")[0];
};

export function handleValidationError(input, message) {
  const errorMessage = input.nextElementSibling;
  if (errorMessage) {
    if (message) {
      errorMessage.textContent = message;
      errorMessage.classList.remove("hidden");
      input.classList.add("invalid");
    } else {
      errorMessage.textContent = "";
      errorMessage.classList.add("hidden");
      input.classList.remove("invalid");
    }
  } else {
    console.warn("Error message element not found for:", input);
  }
}
