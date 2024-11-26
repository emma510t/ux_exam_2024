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
        <p class="error">Error: ${error}</p>
    `;
  document.querySelector("main").append(errorSection);
};
