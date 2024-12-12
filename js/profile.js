import { fetchAPI, loggedInUserID } from "./common.js";

if (loggedInUserID()) {
  if (loggedInUserID() === "2679") {
    window.location.replace("http://127.0.0.1:5500/admin.html");
  } else {
    fetchAPI(`/users/${loggedInUserID()}`, "section", (userData) => {
      const profile = document.createElement("article");

      profile.innerHTML = `
        <dl>
                        <div>
                            <dt>Name</dt>
                            <dd>${userData.first_name} ${userData.last_name}</dd>
                        </div>
                        <div>
                            <dt>Email</dt>
                            <dd>${userData.email}</dd>
                        </div>
                        <div>
                            <dt>Phone</dt>
                            <dd>${userData.phone_number}</dd>
                        </div>
                        <div>
                            <dt>Address</dt>
                            <dd>${userData.address}</dd>
                        </div>
                        <div>
                            <dt>Birthday</dt>
                            <dd>${userData.birth_date}</dd>
                        </div>
                        <div>
                            <dt>Member since</dt>
                            <dd>${userData.membership_date}</dd>
                        </div>
                    </dl>
                    <a href="editprofile.html" class="btn_ghost"><span class="edit-icon"></span>Edit Profile</a>
      `;
      document.querySelector("#profile-section").appendChild(profile);
    });
  }
} else {
  window.location.replace("http://127.0.0.1:5500/login.html");
}
