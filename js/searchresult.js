import { fetchAPI, handleBookCard } from "./common.js";

const urlParams = new URLSearchParams(window.location.search);
const search_text = urlParams.get("search").replaceAll("-", " ");
console.log(search_text);

// fetchAPI(`/books?s=${search_text}`, "main", (results) => {
//   handleBookCard(results);
//   if (results.length){
//     console.log("hello")
//   })
// });

// fetchAPI(`/books?s=${search_text}`, "main", (results) => {
//   console.log(results);
// });
// function getSearchResults(results) {
//   fetchAPI(`/books?s=${search_text}`, "main", ()=>{ window.location.replace(`http://127.0.0.1:5500/searchresult.html/${search_text}`);});
//   console.log(results);
// }
