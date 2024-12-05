import { fetchAPI } from "./common.js";

// Set the maximum date for the userDOB input
document.getElementById("userDOB").max = new Date(new Date().setFullYear(new Date().getFullYear() - 13)).toISOString().split("T")[0];

// Helper function to handle error messages
function handleError(input, message) {
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

// Handle form submission
document.querySelector("#formSignup").addEventListener("submit", async (e) => {
  e.preventDefault();

  let isValid = true;

  // Check validity for all inputs
  document.querySelectorAll("#formSignup input").forEach((input) => {
    if (!input.checkValidity()) {
      isValid = false;
      handleError(input, input.title);
    } else {
      handleError(input, "");
    }
  });

  const password = e.target.userPassword.value.trim();
  const repeatPassword = e.target.userRepeatPassword.value.trim();
  const birthDate = new Date(e.target.userDOB.value);

  // Validate age (13 years old minimum)
  if (new Date() - birthDate < 13 * 365.25 * 24 * 60 * 60 * 1000) {
    handleError(e.target.userDOB, "You must be at least 13 years old to sign up.");
    isValid = false;
  }

  // Validate password match
  if (password !== repeatPassword) {
    handleError(e.target.userRepeatPassword, "Passwords do not match.");
    isValid = false;
  }

  // If the form is valid, submit the data
  if (isValid) {
    const signupData = {
      email: e.target.userEmail.value.trim(),
      first_name: e.target.userFirstname.value.trim(),
      last_name: e.target.userLastname.value.trim(),
      password,
      address: e.target.userAddress.value.trim(),
      phone_number: e.target.userPhone.value.trim(),
      birth_date: e.target.userDOB.value.trim(),
    };

    submitFormData(signupData);
  }
});

// Handle input validation for phone number and other fields
document.querySelectorAll("#formSignup input").forEach((input) => {
  input.addEventListener("input", () => {
    if (!input.checkValidity()) {
      handleError(input, input.title);
    } else {
      handleError(input, "");
    }
  });

  input.addEventListener("blur", () => {
    if (!input.checkValidity()) {
      handleError(input, input.title);
    }
  });
});

// Submit form data to the API
function submitFormData(formData) {
  const signupData = new URLSearchParams(formData);

  fetchAPI(
    "/users",
    null,
    (response) => {
      console.log("Signup successful:", response);
      window.location.replace("http://127.0.0.1:5500/login.html");
    },
    null,
    {
      method: "POST",
      body: signupData,
    }
  );
}

document.querySelector("#formSignup #userRepeatPassword").addEventListener("input", () => {
  const password = document.querySelector("#userPassword").value.trim();
  const repeatPassword = document.querySelector("#userRepeatPassword").value.trim();

  if (password === repeatPassword) {
    handleError(document.querySelector("#userRepeatPassword"), ""); // Clear error when passwords match
  } else {
    handleError(document.querySelector("#userRepeatPassword"), "Passwords do not match.");
  }
});
