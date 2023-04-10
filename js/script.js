const INCOMPLETE_BOOK = "belumSelesai";
const COMPLETE_BOOK = "sudahSelesai";

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

// BAWAH INI DOM.JS

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
    const book = document.createElement("div");
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

    // const cardAction = addAction(selesaiDibaca, idBuku);

    cardContent.append(bookTitle, bookAuthor, bookYear);
    cardContainer.append(cardContent);
    // cardContainer.append(cardAction);
    book.append(cardContainer);

    return book;
}

// function addAction(selesaiDibaca, idBuku) {
//     const cardActions = document.createElement("div");

//     const actionDelete = createActionDelete(idBuku);
//     const actionRead = createActionRead(idBuku);
//     const actionUndo = createActionUndo(idBuku);

//     cardActions.append(actionDelete);

//     if (selesaiDibaca) {
//         cardActions.append(actionUndo);
//     } else {
//         cardActions.append(actionRead);
//     }

//     return cardActions;
// }

// function createActionDelete(idBuku) {
//     const actionDelete = document.createElement("button");
//     actionDelete.classList.add("btn", "btn-sm", "btn-outline-danger", "mx-1");
//     actionDelete.innerHTML = '<i class="bi bi-x"></i>';

//     actionDelete.addEventListener("click", function () {
//         let confirmation = confirm("apakah anda yakin ingin menghapus buku?");

//         if (confirmation) {
//             const cardParent = document.getElementById(idBuku);
//             cardParent.addEventListener("eventDelete", function (event) {
//                 event.target.remove();
//             });
//             cardParent.dispatchEvent(new Event("eventDelete"));

//             deleteBookFromJson(idBuku);
//             updateJson();
//         }
//     });

//     return actionDelete;
// }

// function createActionRead(idBuku) {
//     const action = document.createElement("button");
//     action.classList.add("btn", "btn-sm", "btn-outline-primary");
//     action.innerHTML = '<i class="bi bi-check"></i>';

//     action.addEventListener("click", function () {
//         const cardParent = document.getElementById(idBuku);

//         const bookTitle = cardParent.querySelector(".card-content > h5").innerText;
//         const bookAuthor = cardParent.querySelectorAll(".card-content > span")[0].innerText;
//         const bookYear = cardParent.querySelectorAll(".card-content > span")[1].innerText;

//         cardParent.remove();

//         const book = createBook(idBuku, bookTitle, bookAuthor, bookYear, true);
//         document.getElementById(COMPLETE_BOOK).append(book);

//         deleteBookFromJson(idBuku);
//         const bookObject = composeBookObject(idBuku, bookTitle, bookAuthor, bookYear, true);

//         books.push(bookObject);
//         updateJson();
//     })

//     return action;
// }

// function createActionUndo(idBuku) {
//     const action = document.createElement("button");
//     action.classList.add("btn", "btn-sm", "btn-outline-secondary");
//     action.innerHTML = '<i class="bi bi-arrow-counterclockwise"></i>';

//     action.addEventListener("click", function () {
//         const cardParent = document.getElementById(idBuku);

//         const bookTitle = cardParent.querySelector(".card-content > h5").innerText;
//         const bookAuthor = cardParent.querySelectorAll(".card-content > span")[0].innerText;
//         const bookYear = cardParent.querySelectorAll(".card-content > span")[1].innerText;

//         cardParent.remove();

//         const book = createBook(idBuku, bookTitle, bookAuthor, bookYear, false);
//         document.getElementById(INCOMPLETE_BOOK).append(book);

//         deleteBookFromJson(idBuku);
//         const bookObject = composeBookObject(idBuku, bookTitle, bookAuthor, bookYear, false);

//         books.push(bookObject);
//         updateJson();
//     })

//     return action;
// }

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