const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as templating engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Load books data
const booksData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'books.json'), 'utf8'));

// Helper function to get unique values
const getUniqueValues = (key) => [...new Set(booksData.map(b => b[key]))].sort();

// ─── ROUTES ─────────────────────────────────────────────────────────────────

// Home Page
app.get('/', (req, res) => {
  const featured = booksData.filter(b => b.rating >= 4.7).slice(0, 6);
  const trending = [...booksData].sort((a, b) => b.reviews - a.reviews).slice(0, 8);
  const newArrivals = booksData.slice(40, 50);
  const streams = getUniqueValues('stream');
  const subjects = getUniqueValues('subject');

  res.render('index', {
    title: 'StackLit — VTU Engineering Books',
    featured,
    trending,
    newArrivals,
    streams,
    subjects,
    query: ''
  });
});

// Search Route
app.get('/search', (req, res) => {
  const { q = '', subject = '', stream = '', semester = '', sort = 'relevance' } = req.query;

  let results = [...booksData];

  // Text search
  if (q) {
    const query = q.toLowerCase();
    results = results.filter(book =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.subject.toLowerCase().includes(query) ||
      book.tags.some(tag => tag.toLowerCase().includes(query)) ||
      book.specialty.toLowerCase().includes(query) ||
      book.stream.toLowerCase().includes(query)
    );
  }

  // Filters
  if (subject) results = results.filter(b => b.subject === subject);
  if (stream) results = results.filter(b => b.stream === stream);
  if (semester) results = results.filter(b => b.semester === parseInt(semester));

  // Sort
  switch (sort) {
    case 'rating': results.sort((a, b) => b.rating - a.rating); break;
    case 'price_asc': results.sort((a, b) => a.price - b.price); break;
    case 'price_desc': results.sort((a, b) => b.price - a.price); break;
    case 'reviews': results.sort((a, b) => b.reviews - a.reviews); break;
    default: break;
  }

  const streams = getUniqueValues('stream');
  const subjects = getUniqueValues('subject');

  res.render('search', {
    title: `Search: ${q || 'All Books'} — StackLit`,
    results,
    query: q,
    filters: { subject, stream, semester, sort },
    streams,
    subjects,
    totalResults: results.length
  });
});

// Book Detail Route
app.get('/book/:id', (req, res) => {
  const book = booksData.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.redirect('/');

  const related = booksData
    .filter(b => b.id !== book.id && (b.subject === book.subject || b.stream === book.stream))
    .slice(0, 4);

  res.render('book', {
    title: `${book.title} — StackLit`,
    book,
    related
  });
});

// Browse by Stream
app.get('/stream/:name', (req, res) => {
  const streamName = decodeURIComponent(req.params.name);
  const books = booksData.filter(b => b.stream === streamName);
  const streams = getUniqueValues('stream');
  const subjects = getUniqueValues('subject');

  res.render('search', {
    title: `${streamName} Books — StackLit`,
    results: books,
    query: '',
    filters: { subject: '', stream: streamName, semester: '', sort: 'relevance' },
    streams,
    subjects,
    totalResults: books.length
  });
});

// Browse by Subject
app.get('/subject/:name', (req, res) => {
  const subjectName = decodeURIComponent(req.params.name);
  const books = booksData.filter(b => b.subject === subjectName);
  const streams = getUniqueValues('stream');
  const subjects = getUniqueValues('subject');

  res.render('search', {
    title: `${subjectName} Books — StackLit`,
    results: books,
    query: '',
    filters: { subject: subjectName, stream: '', semester: '', sort: 'relevance' },
    streams,
    subjects,
    totalResults: books.length
  });
});

// API: Autocomplete suggestions
app.get('/api/suggest', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  if (!q || q.length < 2) return res.json([]);

  const suggestions = booksData
    .filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.subject.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q)
    )
    .slice(0, 6)
    .map(b => ({ id: b.id, title: b.title, subject: b.subject, author: b.author }));

  res.json(suggestions);
});

// Start server
app.listen(PORT, () => {
  console.log(`\n  StackLit is running at http://localhost:${PORT}\n`);
});