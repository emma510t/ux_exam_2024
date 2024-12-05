import { fetchAPI, handleValidationError, formattedDate, isYoungerThan13 } from "./common.js";

// Set the maximum date for the userDOB input
document.getElementById("userDOB").max = formattedDate();

// Handle form submission
document.querySelector("#formSignup").addEventListener("submit", async (e) => {
  e.preventDefault();

  let isValid = true;

  // Check validity for all inputs
  document.querySelectorAll("#formSignup input").forEach((input) => {
    if (!input.checkValidity()) {
      isValid = false;
      handleValidationError(input, input.title);
    } else {
      handleValidationError(input, "");
    }
  });

  const password = e.target.userPassword.value.trim();
  const repeatPassword = e.target.userRepeatPassword.value.trim();
  const birthDate = new Date(e.target.userDOB.value);

  // Validate age (13 years old minimum)
  if (isYoungerThan13(birthDate)) {
    handleValidationError(e.target.userDOB, "You must be at least 13 years old to sign up.");
    isValid = false;
  }

  // Validate password match
  if (password !== repeatPassword) {
    handleValidationError(e.target.userRepeatPassword, "Passwords do not match.");
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
    handleValidationError(document.querySelector("#userRepeatPassword"), ""); // Clear error when passwords match
  } else {
    handleValidationError(document.querySelector("#userRepeatPassword"), "Passwords do not match.");
  }
});
