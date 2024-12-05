import { fetchAPI } from "./common.js";

document.querySelector("#formLogin").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = e.target.userEmail.value.trim();
  const password = e.target.userPassword.value.trim();

  const params = new URLSearchParams();
  params.append("email", email);
  params.append("password", password);

  fetchAPI(
    "/users/login",
    (response) => {
      if (Object.keys(response).includes("user_id")) {
        sessionStorage.setItem("b4u_user_id", response.user_id);
        window.location.replace("http://127.0.0.1:5500/index.html");
      }
    },
    null,
    {
      method: "POST",
      body: params,
    }
  );
});
