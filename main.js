// const BASE_URL = "https://boklist-6db80-default-rtdb.europe-west1.firebasedatabase.app/";

// async function getBooks() {
//   const response = await fetch(`${BASE_URL}.json`);
//   const data = await response.json();

//   console.log(data);
// }

// getBooks();



//  /OOP – Book-klass (KRAV)/ 

class Book {
  constructor(id, title, author, favorite, createdAt) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.favorite = favorite;
    this.createdAt = createdAt;
  }
}



async function getBooks() {
  const res = await fetch(`${"https://boklist-6db80-default-rtdb.europe-west1.firebasedatabase.app/"}.json`);
  const data = await res.json();

  if (!data) return [];

  return Object.entries(data).map(
    ([id, book]) =>
      new Book(id, book.title, book.author, book.favorite, book.createdAt)
  );
}



document.addEventListener("DOMContentLoaded", () => {
  const bookForm = document.getElementById("bookForm");
  const titleInput = document.getElementById("title");
  const authorInput = document.getElementById("author");

  bookForm.addEventListener("submit", async e => {
    e.preventDefault();

    await fetch(`${BASE_URL}.json`, {
      method: "POST",
      body: JSON.stringify({
        title: titleInput.value,
        author: authorInput.value,
        favorite: false,
        createdAt: Date.now()
      })
    });

    e.target.reset();
    loadBooks();
  });
});


async function deleteBook(id) {
  await fetch(`${BASE_URL}/${id}.json`, {
    method: "DELETE"
  });
  loadBooks();
}



async function toggleFavorite(book) {
  await fetch(`${BASE_URL}/${book.id}.json`, {
    method: "PATCH",
    body: JSON.stringify({
      favorite: !book.favorite
    })
  });
  loadBooks();
}



const filterBooks = (books, filter) =>
  filter === "favorites"
    ? books.filter(b => b.favorite)
    : books;




  const sortBooks = (books = [], sort) => {
  const copy = [...books];

  if (sort === "title-asc") return copy.sort((a, b) => a.title.localeCompare(b.title));
  if (sort === "title-desc") return copy.sort((a, b) => b.title.localeCompare(a.title));
  if (sort === "author-asc") return copy.sort((a, b) => a.author.localeCompare(b.author));
  if (sort === "author-desc") return copy.sort((a, b) => b.author.localeCompare(a.author));
  if (sort === "newest") return copy.sort((a, b) => b.createdAt - a.createdAt);
  if (sort === "oldest") return copy.sort((a, b) => a.createdAt - b.createdAt);

  return copy;
};



async function loadBooks() {
  const books = await getBooks() || [];

  const filter = filterSelect ? filterSelect.value : "all";
  const sort = sortSelect ? sortSelect.value : "";

  const filtered = filterBooks(books, filter);
  const sorted = sortBooks(filtered, sort);

  bookList.innerHTML = "";

  sorted.forEach(book => {
  const li = document.createElement("li");

  // ✅ IF–ELSE (exactly what you asked)
  if (book.favorite === true) {
    li.style.textDecoration = "underline";
  } else {
    li.style.textDecoration = "none";
  }

  li.innerHTML = `
    <strong>${book.title}</strong> – ${book.author}
    <button onclick='toggleFavorite(${JSON.stringify(book)})'>⭐</button>
    <button onclick='deleteBook("${book.id}")'>❌</button>
  `;

  bookList.appendChild(li);
});
}


const filterSelect = document.getElementById("filter");
const sortSelect = document.getElementById("sort");
const bookList = document.getElementById("bookList");



filterSelect.addEventListener("change", loadBooks);
sortSelect.addEventListener("change", loadBooks);
window.onload = loadBooks;


