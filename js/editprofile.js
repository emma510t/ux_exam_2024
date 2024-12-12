import { fetchAPI, loggedInUserID, isYoungerThan13, handleValidationError, formattedDate, logout } from "./common.js";

if (loggedInUserID()) {
  if (loggedInUserID() === "2679") {
    window.location.replace("http://127.0.0.1:5500/admin.html");
  } else {
    fetchAPI(`/users/${loggedInUserID()}`, "section", (userData) => {
      const formEditProfile = document.createElement("form");
      formEditProfile.id = "editProfileForm";

      formEditProfile.innerHTML = `
                    <div>
                        <label for="userFirstname">First name</label>
                        <input type="text" id="userFirstname" name="userFirstname" required minlength="2" maxlength="50"
                        pattern="[A-Za-z '\\-]+"
                        title="First name must be 2–50 characters and can include letters, spaces, hyphens, or apostrophes."
                        value="${userData.first_name}">
                        <span class="error-message hidden"></span>
                    </div>

                    <div>
                        <label for="userLastname">Last name</label>
                        <input type="text" id="userLastname" name="userLastname" required minlength="2" maxlength="50"
                        pattern="[A-Za-z '\\-]+"
                        title="Last name must be 2–50 characters and can include letters, spaces, hyphens, or apostrophes."
                        value="${userData.last_name}">
                        <span class="error-message hidden"></span>
                    </div>

                    <div>
                        <label for="userEmail">E-mail</label>
                        <input type="email" id="userEmail" name="userEmail" required
                            title="Please enter a valid email address." value="${userData.email}">
                        <span class="error-message hidden"></span>
                    </div>

                    <div>
                        <label for="userPhone">Phone number</label>
                        <input type="tel" id="userPhone" name="userPhone" required pattern="[0-9 \\-]{7,15}"
                        title="Phone number must be 7–15 digits and can include spaces or dashes."
                        value="${userData.phone_number}">
                        <span class="error-message hidden"></span>
                    </div>

                    <div>
                        <label for="userAddress">Address</label>
                        <input type="text" id="userAddress" name="userAddress" required maxlength="100"
                            title="Address cannot exceed 100 characters." value="${userData.address}">
                        <span class="error-message hidden"></span>
                    </div>

                    <div>
                        <label for="userDOB">Date of birth</label>
                        <input type="date" id="userDOB" name="userDOB" max="${formattedDate()}" required
                            title="You must be at least 13 years old." value="${userData.birth_date}">
                        <span class="error-message hidden"></span>
                    </div>
                    <button class="btn_prim" type="submit">Save changes</button>
 
      `;

      document.querySelector("#edit_profile_section").appendChild(formEditProfile);

      formEditProfile.addEventListener("submit", async (e) => {
        e.preventDefault();

        let isValid = true;

        // Check validity for all inputs
        const birthDate = new Date(e.target.userDOB.value);

        // Validate age
        if (isYoungerThan13(birthDate)) {
          handleValidationError(e.target.userDOB, "You must be at least 13 years old to sign up.");
          isValid = false;
        }

        // If the form is valid, submit the data
        if (isValid) {
          const editProfileData = {
            email: e.target.userEmail.value.trim(),
            first_name: e.target.userFirstname.value.trim(),
            last_name: e.target.userLastname.value.trim(),
            address: e.target.userAddress.value.trim(),
            phone_number: e.target.userPhone.value.trim(),
            birth_date: e.target.userDOB.value.trim(),
          };

          submitFormData(editProfileData);
        }
      });
      // Handle input validation for phone number and other fields
      document.querySelectorAll("input").forEach((input) => {
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
    });
  }
} else {
  window.location.replace("http://127.0.0.1:5500/login.html");
}

document.querySelector("#formDeleteProfile").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (e.target.delete_confirmation.checked) {
    deleteUser();
  } else {
    handleValidationError(e.target.delete_confirmation, "You must checck the checkbox to delete your account");
  }
});

// Submit form data to the API
function submitFormData(formData) {
  const editProfileData = new URLSearchParams(formData);

  fetchAPI(
    `/users/${loggedInUserID()}`,
    null, //null because not-get goes to toast
    (response) => {
      console.log("Update successful:", response);
      window.location.replace("http://127.0.0.1:5500/profile.html");
    },
    null,
    {
      method: "PUT",
      body: editProfileData,
    }
  );
}

function deleteUser() {
  fetchAPI(
    `/users/${loggedInUserID()}`,
    null, //null because not-get goes to toast
    (response) => {
      console.log("Deleted:", response);
      window.location.replace("http://127.0.0.1:5500/login.html");
      sessionStorage.removeItem("b4u_user_id");
    },
    null,
    {
      method: "DELETE",
    }
  );
}
