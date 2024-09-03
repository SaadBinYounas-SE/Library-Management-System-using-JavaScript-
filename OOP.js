class Book {
    constructor(title, author, publisher) {
        this.title = title;
        this.author = author;
        this.publisher = publisher;
    }
}

class UI {
    addBookToList(book) {
        const list = document.getElementById('book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.publisher}</td>
        <td><a href="#" class="delete">X</a></td>`;
        
        list.appendChild(row);
    }

    showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        setTimeout(function(){
            document.querySelector('.alert').remove();
        }, 3000);
    }

    deleteBook(target) {
        if(target.classList.contains('delete')) {
            target.parentElement.parentElement.remove(); 

            const title = target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
            Store.removeBook(title);
        }
    }

    clearFields() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('publisher').value = '';
    }
}

class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();

        // Check if the book already exists
        if (books.some(storedBook => 
            storedBook.title === book.title && 
            storedBook.author === book.author && 
            storedBook.publisher === book.publisher)) {
            return false;  // Return false if the book already exists
        }

        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
        return true;  // Return true if the book was added successfully
    }

    static removeBook(title) {
        let books = Store.getBooks();

        books = books.filter(book => book.title !== title);

        localStorage.setItem('books', JSON.stringify(books));
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const ui = new UI();
    const books = Store.getBooks();
    
    books.forEach(function(book) {
        ui.addBookToList(book);
    });
});

document.getElementById('book-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const publisher = document.getElementById('publisher').value;
    
    const book = new Book(title, author, publisher);
    const ui = new UI();

    if(title === '' || author === '' || publisher === '') {
        ui.showAlert('Please fill in all fields', 'error');
    } else {
        if (Store.addBook(book)) {
            ui.addBookToList(book);
            ui.showAlert('Book added', 'success');
            ui.clearFields();
        } else {
            ui.showAlert('Book already exists', 'error');
        }
    }
});

document.getElementById('book-list').addEventListener('click', function(e){
    const ui = new UI();
    ui.deleteBook(e.target);
    ui.showAlert('Book Removed', 'success');
});
