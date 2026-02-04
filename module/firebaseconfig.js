const BASE_URL = "https://boklist-6db80-default-rtdb.europe-west1.firebasedatabase.app/";

async function getBooks() {
  const response = await fetch(`${BASE_URL}.json`);
  const data = await response.json();

  console.log(data);
}

getBooks();
