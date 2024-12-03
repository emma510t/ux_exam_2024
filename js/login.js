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
      } else {
        throw new Error(data.error);
      }
    },
    null,
    {
      method: "POST",
      body: params,
    }
  );

  /* fetch(`${baseUserUrl}/validation`, {
    
  })
    .then(handleAPIError)
    .then((data) => {
      // Check for key "user_id" in response
      if (Object.keys(data).includes("user_id")) {
        sessionStorage.setItem("food_repo_user_id", data.user_id);
        // As loadFavourites returns a promise, it can be treated asynchronously,
        // making the page redirection wait until loadFavourites is finished
        loadFavourites(data.user_id).then(() => {
          window.location.href = "index.html";
        });
      } else {
        throw new Error(data.error);
      }
    })
    .catch(handleFetchCatchError); */
});
