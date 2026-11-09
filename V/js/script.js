
let books = [
    {
        title: "Laskar Pelangi",
        author: "Andrea Hirata",
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500"
    },
    {
        title: "Bumi",
        author: "Tere Liye",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500"
    },
    {
        title: "Negeri 5 Menara",
        author: "Ahmad Fuadi",
        image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500"
    },
    {
        title: "Filosofi Teras",
        author: "Henry Manampiring",
        image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=500"
    }
];

function simpanData() {
    try {
        localStorage.setItem(
            "koleksiPerpustakaan",
            JSON.stringify(books)
        );
    } catch (error) {
        alert("Penyimpanan penuh. Gunakan foto yang lebih kecil.");
    }
}

function ambilData() {
    try {
        const data = localStorage.getItem("koleksiPerpustakaan");
        if (data) {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) books = parsed;
        }
    } catch (error) {
        console.log("Data buku tidak dapat dibaca.");
    }
}

function tampilkanJumlah() {
    const jumlah = document.getElementById("jumlahBuku");

    if (jumlah) {
        jumlah.textContent = books.length;
    }
}

function tampilkanBuku(data = books) {
    const container = document.getElementById("bookContainer");

    if (!container) return;

    container.innerHTML = "";

    if (data.length === 0) {
        container.innerHTML =
            '<div class="empty">Buku tidak ditemukan.</div>';
        return;
    }

    data.forEach(book => {
        const index = books.indexOf(book);

        const card = document.createElement("div");
        card.className = "book-card";

        const img = document.createElement("img");
        img.src = book.image;
        img.alt = book.title;

        img.onerror = function() {
            this.src = "https://placehold.co/400x500?text=Foto+Buku";
        };

        const info = document.createElement("div");
        info.className = "book-info";

        const title = document.createElement("h3");
        title.textContent = book.title;

        const author = document.createElement("p");
        author.textContent = "Penulis: " + book.author;

        const actions = document.createElement("div");
        actions.className = "book-actions";

        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.hidden = true;

        const edit = document.createElement("button");
        edit.textContent = "Ganti Foto";
        edit.className = "edit-btn";

        edit.onclick = () => input.click();

        input.onchange = event => {
            const file = event.target.files[0];

            if (!file) return;

            if (!file.type.startsWith("image/")) {
                alert("Pilih file gambar!");
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                alert("Ukuran foto maksimal 2 MB!");
                return;
            }

            const reader = new FileReader();

            reader.onload = e => {
                books[index].image = e.target.result;
                simpanData();
                tampilkanBuku();
                tampilkanJumlah();
            };

            reader.readAsDataURL(file);
        };

        const hapus = document.createElement("button");
        hapus.textContent = "Hapus";
        hapus.className = "delete-btn";

        hapus.onclick = () => {
            if (confirm("Hapus buku ini?")) {
                books.splice(index, 1);
                simpanData();
                tampilkanBuku();
                tampilkanJumlah();
            }
        };

        actions.append(edit, hapus);

        info.append(title, author, input, actions);
        card.append(img, info);
        container.appendChild(card);
    });
}

function tambahBuku() {
    const title = prompt("Masukkan judul buku:");

    if (!title || !title.trim()) return;

    const author = prompt("Masukkan nama penulis:");

    if (!author || !author.trim()) return;

    const image = prompt("Masukkan URL foto buku (opsional):");

    books.push({
        title: title.trim(),
        author: author.trim(),
        image: image && image.trim()
            ? image.trim()
            : "https://placehold.co/400x500?text=Foto+Buku"
    });

    simpanData();
    tampilkanBuku();
    tampilkanJumlah();
}

const search = document.getElementById("searchInput");

if (search) {
    search.addEventListener("input", function() {
        const keyword = this.value.toLowerCase();

        const hasil = books.filter(book =>
            book.title.toLowerCase().includes(keyword) ||
            book.author.toLowerCase().includes(keyword)
        );

        tampilkanBuku(hasil);
    });
}

// JALANKAN WEBSITE
ambilData();
tampilkanBuku();
tampilkanJumlah();
