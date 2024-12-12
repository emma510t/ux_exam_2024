import { loggedInUserID, fetchAPI, handleValidationError, createToast } from "./common.js";

if (loggedInUserID()) {
  if (loggedInUserID() == 2679) {
    fetchAuthors();
    fetchPublishers();
  } else {
    window.location.replace("http://127.0.0.1:5500/profile.html");
  }
} else {
  window.location.replace("http://127.0.0.1:5500/login.html");
}

document.querySelector("#addNewBookForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  let isValid = true;

  const publishingYearInput = e.target.bookPublishingYear;

  if (parseInt(publishingYearInput.value.trim(), 10) > new Date().getFullYear()) {
    isValid = false;
    handleValidationError(publishingYearInput, "The year must be lower or equal to the current year.");
  }

  if (isValid) {
    const newBookData = {
      title: e.target.bookTitle.value.trim(),
      author_id: e.target.bookAuthor.value.trim(),
      publisher_id: e.target.bookPublishingCompany.value.trim(),
      publishing_year: publishingYearInput.value.trim(),
    };
    submitFormData(newBookData, "books", "book");

    document.querySelectorAll("#addNewBookForm input").forEach((input) => {
      input.value = ""; // Clear the input value
    });

    document.querySelectorAll("#addNewBookForm select").forEach((select) => {
      select.selectedIndex = 0;
    });
  }
});

document.querySelector("#addNewAuthorForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  let isValid = true;

  if (isValid) {
    const newAuthorData = {
      first_name: e.target.authorFirstname.value.trim(),
      last_name: e.target.authorLastname.value.trim(),
    };

    await submitFormData(newAuthorData, "authors", "author");

    document.querySelectorAll("#addNewAuthorForm input").forEach((input) => {
      input.value = ""; // Clear the input value
      fetchAuthors();
    });
  }
});

document.querySelector("#addNewPublisherForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  let isValid = true;

  if (isValid) {
    const newPublishersData = {
      name: e.target.publisherName.value.trim(),
    };

    await submitFormData(newPublishersData, "publishers", "publisher");
    document.querySelector("#addNewPublisherForm input").value = "";
    fetchPublishers();
  }
});

document.querySelectorAll("main input").forEach((input) => {
  input.addEventListener("input", () => {
    if (!input.checkValidity()) {
      handleValidationError(input, input.title);
    } else {
      handleValidationError(input, "");
    }
  });

  input.addEventListener("blur", () => {
    if (!input.checkValidity()) {
      handleValidationError(input, input.title);
    }
  });
});

function submitFormData(formData, url, type) {
  const adminFormData = new URLSearchParams(formData);

  return new Promise((resolve) => {
    fetchAPI(
      `/admin/${url}`,
      null, // null because not-get goes to toast
      (response) => {
        console.log(`Upload of ${type} successful:`, response);
        createToast(`The ${type} was added successfully`, "positive");
        resolve(response); // Resolve the promise when successful
      },
      null,
      {
        method: "POST",
        body: adminFormData,
      }
    );
  });
}

function fetchAuthors() {
  fetchAPI("/authors", "#authorSelectContainer", (response) => {
    const authorsArray = response.sort((a, b) => {
      return a.author_name.localeCompare(b.author_name);
    });

    const authorSelect = document.createElement("select");
    authorSelect.id = "bookAuthor";
    authorSelect.name = "bookAuthor";
    authorSelect.required = true;

    authorSelect.innerHTML = '<option value="" disabled selected>Select an author</option>';

    // Add new options
    authorsArray.forEach((author) => {
      const authorOption = document.createElement("option");
      authorOption.value = author.author_id;
      authorOption.textContent = author.author_name;

      authorSelect.appendChild(authorOption);
    });

    authorSelectContainer = document.querySelector("#authorSelectContainer");
    authorSelectContainer.innerHTML = "";
    authorSelectContainer.append(authorSelect);
  });
}

function fetchPublishers() {
  fetchAPI("/publishers", "#publisherSelectContainer", (response) => {
    const publishersArray = response.sort((a, b) => {
      return a.publisher_name.localeCompare(b.publisher_name);
    });

    const publisherSelect = document.createElement("select");
    publisherSelect.id = "bookPublishingCompany";
    publisherSelect.name = "bookPublishingCompany";
    publisherSelect.required = true;

    publisherSelect.innerHTML = '<option value="" disabled selected>Select a publishing company</option>';

    // A new options
    publishersArray.forEach((publisher) => {
      const publisherOption = document.createElement("option");
      publisherOption.value = publisher.publisher_id;
      publisherOption.textContent = publisher.publisher_name;

      publisherSelect.appendChild(publisherOption);
    });
    publisherSelectContainer = document.querySelector("#publisherSelectContainer");
    publisherSelectContainer.innerHTML = "";
    publisherSelectContainer.append(publisherSelect);
  });
}
