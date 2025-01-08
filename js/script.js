// Ini bagian JavaScript

// Menyimpan semua data buku ke dalam array
let books = [];

// Mendapatkan referensi ke elemen-elemen yang ada di dalam DOM
const bookForm = document.getElementById("bookForm");
const searchBookForm = document.getElementById("searchBook");
const incompleteBookList = document.getElementById("incompleteBookList");
const completeBookList = document.getElementById("completeBookList");
const bookFormSubmitButton = document.getElementById("bookFormSubmit");
const bookFormIsCompleteCheckbox = document.getElementById("bookFormIsComplete");

// NOTE: Bagian ini cukup membingungkan  karena harus mengecek terus di console browser untuk memastikannya
// Fungsi untuk menyimpan data buku ke dalam local storage
function saveToLocalStorage() {
    localStorage.setItem("books", JSON.stringify(books));
}

// Fungsi untuk memuat data buku dari local storage
function loadFromLocalStorage() {
    const storedBooks = localStorage.getItem("books");
    if (storedBooks) {
        books = JSON.parse(storedBooks);
        books.forEach((book) => {
            renderBook(book);
        });
    }
}

// NOTE: Bagian ini juga sedikit membingungkan, karena harus membuat Event listener untuk memastikan tombol-tombol bekerja dengan benar.
// Fungsi untuk merender satu buku ke dalam daftar
function renderBook(book) {
    // Membuat elemen container untuk buku
    const bookElement = document.createElement("div");
    bookElement.setAttribute("data-bookid", book.id);
    bookElement.setAttribute("data-testid", "bookItem");
    bookElement.className = "book-card"; // Tambahkan class untuk styling

    // Menambahkan judul buku
    const bookTitle = document.createElement("h3");
    bookTitle.setAttribute("data-testid", "bookItemTitle");
    bookTitle.textContent = book.title;

    // Menambahkan penulis buku
    const bookAuthor = document.createElement("p");
    bookAuthor.setAttribute("data-testid", "bookItemAuthor");
    bookAuthor.textContent = `Penulis: ${book.author}`;

    // Menambahkan tahun rilis buku
    const bookYear = document.createElement("p");
    bookYear.setAttribute("data-testid", "bookItemYear");
    bookYear.textContent = `Tahun: ${book.year}`;

    // Membuat tombol aksi untuk setiap buku
    const actionContainer = document.createElement("div");

    // Tombol untuk mengubah status selesai/belum selesai
    const toggleButton = document.createElement("button");
    toggleButton.setAttribute("data-testid", "bookItemIsCompleteButton");
    toggleButton.textContent = book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca";
    toggleButton.addEventListener("click", () => toggleBookStatus(book.id));

    // Tombol untuk menghapus buku
    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
    deleteButton.textContent = "Hapus Buku";
    deleteButton.addEventListener("click", () => removeBook(book.id));

    // Tombol untuk mengedit data buku
    const editButton = document.createElement("button");
    editButton.setAttribute("data-testid", "bookItemEditButton");
    editButton.textContent = "Edit Buku";
    editButton.addEventListener("click", () => editBook(book.id));

    // Menambahkan tombol-tombol ke dalam container aksi
    actionContainer.append(toggleButton, deleteButton, editButton);

    // Menambahkan semua elemen ke dalam elemen container buku
    bookElement.append(bookTitle, bookAuthor, bookYear, actionContainer);

    // Menempatkan elemen ke dalam daftar yang sesuai (selesai/belum selesai)
    if (book.isComplete) {
        completeBookList.appendChild(bookElement);
    } else {
        incompleteBookList.appendChild(bookElement);
    }
}

// Fungsi untuk menambahkan buku baru
function addBook(event) {
    event.preventDefault();

    // Mengambil nilai dari form
    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = document.getElementById("bookFormYear").value;
    const isComplete = bookFormIsCompleteCheckbox.checked;

    // Membuat objek buku baru
    const newBook = {
        id: +new Date(),
        title,
        author,
        year,
        isComplete,
    };

    // Menambahkan buku ke dalam array
    books.push(newBook);

    // Menyimpan data ke local storage
    saveToLocalStorage();

    // Merender buku baru
    renderBook(newBook);

    // Reset form setelah buku ditambahkan
    bookForm.reset();
    updateSubmitButtonText();
}

// Fungsi untuk menghapus buku
function removeBook(bookId) {
    // Filter array untuk menghapus buku yang memiliki ID tertentu
    books = books.filter((book) => book.id !== bookId);

    // Menyimpan perubahan ke local storage
    saveToLocalStorage();

    // Menghapus elemen dari DOM
    const bookElement = document.querySelector(`[data-bookid="${bookId}"]`);
    if (bookElement) {
        bookElement.remove();
    }
}

// Fungsi untuk mengubah status selesai/belum selesai buku
function toggleBookStatus(bookId) {
    const book = books.find((b) => b.id === bookId);
    if (book) {
        // Ubah status selesai
        book.isComplete = !book.isComplete;

        // Simpan perubahan ke local storage
        saveToLocalStorage();

        // Refresh daftar buku
        incompleteBookList.innerHTML = "";
        completeBookList.innerHTML = "";
        books.forEach((book) => renderBook(book));
    }
}

// Fungsi untuk mengedit data buku
function editBook(bookId) {
    const book = books.find((b) => b.id === bookId);
    if (book) {
        // Mengisi form dengan data buku yang akan diedit
        document.getElementById("bookFormTitle").value = book.title;
        document.getElementById("bookFormAuthor").value = book.author;
        document.getElementById("bookFormYear").value = book.year;
        bookFormIsCompleteCheckbox.checked = book.isComplete;

        // Hapus buku lama setelah data dimasukkan
        removeBook(bookId);
    }
}

// NOTE: Bagian mencari buku adalah opsional jadi saya masih sedikit kebingungan ketika membuatnya
// Fungsi untuk mencari buku berdasarkan judul
function searchBook(event) {
    event.preventDefault();

    // Mengambil nilai dari input pencarian
    const query = document.getElementById("searchBookTitle").value.toLowerCase();

    // Filter buku berdasarkan judul
    const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(query));

    // Membersihkan daftar dan menampilkan buku yang sesuai
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";
    filteredBooks.forEach((book) => renderBook(book));
}

// Fungsi untuk memperbarui teks tombol submit
function updateSubmitButtonText() {
    const span = bookFormSubmitButton.querySelector("span");
    span.textContent = bookFormIsCompleteCheckbox.checked
        ? "Selesai dibaca"
        : "Belum selesai dibaca";
}

// Event listener untuk perubahan checkbox
bookFormIsCompleteCheckbox.addEventListener("change", updateSubmitButtonText);

// Event listener untuk form tambah buku
bookForm.addEventListener("submit", addBook);

// Event listener untuk form pencarian
searchBookForm.addEventListener("submit", searchBook);

// Memuat data dari local storage saat halaman pertama kali dimuat
loadFromLocalStorage();

// NOTE: Setelah sekian lama saya membuat tugas ini akhirnya selesai dan merasa sedikit lega,
// karena bisa menyelesaikan tugas ini dengan sedikit menuliskan kode yang agak membingungkan dan melihat ulang/memahami ulang materi yang diberikan.
// Dan juga saya memiliki jadwal UAS jadi mungkin membutuhkan waktu lama untuk menyelesaikan tugas ini,
// Jadi semoga sudah sesuai dengan kriterian yang diberikan.Terimakasih.