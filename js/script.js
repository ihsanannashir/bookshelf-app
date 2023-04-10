const INCOMPLETE_BOOK = "belumSelesai";
const COMPLETE_BOOK = "sudahSelesai";
const BOOKS_KEY = "BOOKSHELF_APPS";

let books = [];

function checkBrowser() {
    if (typeof Storage === "undefined") {
        alert("Browsermu tidak mendukung local storage!");
        return false;
    }
    return true;
}

function updateJson() {
    if (checkBrowser()) {
        localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
    }
}

function fetchJson() {
    let data = JSON.parse(localStorage.getItem(BOOKS_KEY));

    if (data !== null) {
        books = data;
    }
    document.dispatchEvent(new Event("onjsonfetched"));
}

function composeBookObject(id, title, author, year, isComplete) {
    return {
        id, title, author, year, isComplete,
    };
}

function renderFromBooks() {
    for (book of books) {
        const newBook = createBook(book.id, book.title, book.author, book.year, book.isComplete);

        if (book.isComplete) {
            document.getElementById(COMPLETE_BOOK).append(newBook);
        } else {
            document.getElementById(INCOMPLETE_BOOK).append(newBook);
        }
    }
}

function deleteBookFromJson(idBook) {
    for (let arrayPosition = 0; arrayPosition < books.length; arrayPosition++) {
        if (books[arrayPosition].id == idBook) {
            books.splice(arrayPosition, 1);
            break;
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {

    const formInput = document.getElementById("tambahBuku");
    const formSearch = document.getElementById("cariJudul");

    formInput.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();

        document.getElementById("judul").value = "";
        document.getElementById("penulis").value = "";
        document.getElementById("tahun").value = "";
        document.getElementById("selesai-dibaca").checked = false;
    });

    formSearch.addEventListener("submit", function (event) {
        event.preventDefault();

        const inputSearch = document.getElementById("cari-judul").value;
        bookSearch(inputSearch);
    })

    if (checkBrowser()) {
        fetchJson();
    }
});

document.addEventListener("onjsonfetched", function () {
    renderFromBooks();
});

function addBook() {
    const idBuku = +new Date();
    const judul = document.getElementById("judul").value;
    const penulis = document.getElementById("penulis").value;
    const tahun = document.getElementById("tahun").value;
    const selesaiDibaca = document.getElementById("selesai-dibaca").checked;

    const book = createBook(idBuku, judul, penulis, tahun, selesaiDibaca);
    const bookObject = composeBookObject(idBuku, judul, penulis, tahun, selesaiDibaca);

    books.push(bookObject);

    if (selesaiDibaca) {
        document.getElementById(COMPLETE_BOOK).append(book);
    } else {
        document.getElementById(INCOMPLETE_BOOK).append(book);
    }

    updateJson();
}

function createBook(idBuku, judul, penulis, tahun, selesaiDibaca) {
    const book = document.createElement("article");
    book.setAttribute("id", idBuku)

    const bookTitle = document.createElement("div");
    bookTitle.classList.add("cardTitle");
    bookTitle.innerText = judul;

    const bookAuthor = document.createElement("div");
    bookAuthor.classList.add("cardAuthor");
    bookAuthor.innerText = penulis;

    const bookYear = document.createElement("div");
    bookYear.classList.add("cardYear");
    bookYear.innerText = tahun;

    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card-1");

    const cardContent = document.createElement("div");
    cardContent.classList.add("card-content");

    const cardAction = addAction(selesaiDibaca, idBuku);

    cardContent.append(bookTitle, bookAuthor, bookYear);
    cardContainer.append(cardContent);
    cardContainer.append(cardAction);
    book.append(cardContainer);

    return book;
}

function addAction(selesaiDibaca, idBuku) {
    const cardButton = document.createElement("div");
    const actionRead = createActionRead(idBuku);
    const actionUndo = createActionUndo(idBuku);
    const actionDelete = createActionDelete(idBuku);

    if (selesaiDibaca) {
        cardButton.append(actionUndo);
    } else {
        cardButton.append(actionRead);
    }
    cardButton.append(actionDelete);

    return cardButton;
}

function createActionDelete(idBuku) {
    const actionDelete = document.createElement("button");
    actionDelete.classList.add("button-delete");
    actionDelete.innerHTML = 'Hapus';

    actionDelete.addEventListener("click", function () {
        let confirmation = confirm("Apakah anda yakin ingin menghapus buku dari daftar?");

        if (confirmation) {
            const cardParent = document.getElementById(idBuku);
            cardParent.addEventListener("eventDelete", function (event) {
                event.target.remove();
            });
            cardParent.dispatchEvent(new Event("eventDelete"));

            deleteBookFromJson(idBuku);
            updateJson();
        }
    });

    return actionDelete;
}

function createActionRead(idBuku) {
    const action = document.createElement("button");
    action.classList.add("button-card");
    action.innerHTML = 'Selesai';

    action.addEventListener("click", function () {
        const cardParent = document.getElementById(idBuku);
        const bookTitle = cardParent.querySelectorAll(".card-content > div")[0].innerText;
        const bookAuthor = cardParent.querySelectorAll(".card-content > div")[1].innerText;
        const bookYear = cardParent.querySelectorAll(".card-content > div")[2].innerText;

        cardParent.remove();

        const book = createBook(idBuku, bookTitle, bookAuthor, bookYear, true);
        document.getElementById(COMPLETE_BOOK).append(book);

        deleteBookFromJson(idBuku);
        const bookObject = composeBookObject(idBuku, bookTitle, bookAuthor, bookYear, true);

        books.push(bookObject);
        updateJson();
    })

    return action;
}

function createActionUndo(idBuku) {
    const action = document.createElement("button");
    action.classList.add("button-card");
    action.innerHTML = 'Belum Selesai';

    action.addEventListener("click", function () {
        const cardParent = document.getElementById(idBuku);

        const bookTitle = cardParent.querySelectorAll(".card-content > div")[0].innerText;
        const bookAuthor = cardParent.querySelectorAll(".card-content > div")[1].innerText;
        const bookYear = cardParent.querySelectorAll(".card-content > div")[2].innerText;

        cardParent.remove();

        const book = createBook(idBuku, bookTitle, bookAuthor, bookYear, false);
        document.getElementById(INCOMPLETE_BOOK).append(book);

        deleteBookFromJson(idBuku);
        const bookObject = composeBookObject(idBuku, bookTitle, bookAuthor, bookYear, false);

        books.push(bookObject);
        updateJson();
    })

    return action;
}

function bookSearch(keyword) {
    const filter = keyword.toUpperCase();
    const titles = document.getElementsByClassName("cardTitle");

    for (let i = 0; i < titles.length; i++) {
        const titlesText = titles[i].textContent || titles[i].innerText;

        if (titlesText.toUpperCase().indexOf(filter) > -1) {
            titles[i].closest(".card-1").style.display = "";
        } else {
            titles[i].closest(".card-1").style.display = "none";
        }
    }
}