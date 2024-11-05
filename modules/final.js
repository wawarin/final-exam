const express = require('express');
const router = express.Router();

let books = {
    1: { "author": "Chinua Achebe", "title": "Things Fall Apart", "copies": 10, "reviews": { "Waa": "test_review" } },
    2: { "author": "Hans Christian Andersen", "title": "Fairy tales", "copies": 10, "reviews": {} },
    3: { "author": "Dante Alighieri", "title": "The Divine Comedy", "copies": 10, "review": {} },
    4: { "author": "Unknown", "title": "The Epic Of Gilgamesh", "copies": 10, "review": {} },
    5: { "author": "Unknown", "title": "The Book Of Job", "copies": 10, "review": {} },
    6: { "author": "Unknown", "title": "One Thousand and One Nights", "copies": 10, "review": {} },
    7: { "author": "Unknown", "title": "Nj\u00e1l's Saga", "copies": 10, "review": {} },
    8: { "author": "Jane Austen", "title": "Pride and Prejudice", "copies": 10, "review": {} },
    9: { "author": "Honor\u00e9 de Balzac", "title": "Le P\u00e8re Goriot", "copies": 10, "review": {} },
    10: { "author": "Samuel Beckett", "title": "Molloy, Malone Dies, The Unnamable, the trilogy", "copies": 10, "review": {} }
}

let users = []


router.get('/', function (req, res) {
    res.json({ status: 200, data: books, message: `Get book successfully.` });
});


// Get book details based on ISBN
router.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn])
});


// Get book details based on author
router.get('/author/:author', function (req, res) {
    // a = res.send(JSON.stringify({ books }, null, 4));
    // JSON.parse(a);
    const author = req.params.author;
    console.log(author);
    const filteredBooks = Object.keys(books).filter(
        key => books[key].author === req.params.author
    ).map(key => books[key]);
    console.log(filteredBooks);
    res.send(filteredBooks)
});



// Get all books based on title

router.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const filteredBooks = Object.keys(books).filter(
        key => books[key].title === req.params.title
    ).map(key => books[key]);
    console.log(filteredBooks);
    res.send(filteredBooks)
});


//  Get book review

router.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]["reviews"])
});


// Sign in as Customer
router.post("/", (req, res) => {
    users.push({ "firstName": req.query.firstName, "lastName": req.query.lastName, "ph_no": req.query.ph_no, "email": req.query.email });
    res.send("The user /n" + (req.query.firstName) + (req.query.lastName) + "has been added!")
});

router.get("/login", (req, res) => {
    users.push({
        "firstName": req.query.firstName,
        "lastName": req.query.lastName,
    });

    res.send(`The user \n${req.query.firstName} ${req.query.lastName} has been added!`);
});

// Add books
router.post("/book", (req, res) => {
    const { isbn, author, title, copies = 10, review = {} } = req.body;

    // Validate required fields
    if (!isbn || !author || !title) {
        return res.status(400).send("Error: 'isbn', 'author', and 'title' are required fields.");
    }

    // Add the new book with a unique ISBN key to the books object
    books[isbn] = { author, title, copies, review };
    
    res.send(`The book with ISBN ${isbn} has been added successfully!`);
});

router.delete("/book/:isbn", (req, res) => {
    const { isbn } = req.params;

    // Check if the book exists
    if (books[isbn]) {
        // Delete the book from the books object
        delete books[isbn];
        res.send(`The book with ISBN ${isbn} has been deleted successfully.`);
    } else {
        // If the book with the given ISBN is not found
        res.status(404).send(`Error: Book with ISBN ${isbn} not found.`);
    }
});

router.get("/books", async (req, res) => {
    try {
        // Simulate an asynchronous operation (e.g., a database query)
        const getAllBooks = async () => {
            // If using a real database, replace this with the actual async call, like:
            // return await Book.find({});
            return books;
        };
        
        const allBooks = await getAllBooks();
        res.json(allBooks);
    } catch (error) {
        // Error handling
        res.status(500).send("An error occurred while fetching the books.");
    }
});

router.get("/book/:isbn", (req, res) => {
    const { isbn } = req.params;

    // Function to find a book by ISBN using a Promise
    const findBookByIsbn = (isbn) => {
        return new Promise((resolve, reject) => {
            const book = books[isbn];
            if (book) {
                resolve(book); // Resolve with the found book
            } else {
                reject(new Error("Book not found")); // Reject if the book does not exist
            }
        });
    };

    // Call the function and handle the promise
    findBookByIsbn(isbn)
        .then((book) => {
            res.json(book); // Send the book details in response
        })
        .catch((error) => {
            res.status(404).send(error.message); // Handle error and send a 404 status
        });
});


module.exports = router;