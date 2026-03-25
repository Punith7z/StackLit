StackLit — Book Recommendation Platform

StackLit is a web-based application designed to help students discover relevant academic books based on subject, semester, and quality indicators such as ratings. The platform emphasizes clarity in presentation and ease of navigation, enabling users to quickly identify useful resources.

⸻

Overview

The application delivers curated book listings through a structured interface. Each entry includes essential metadata such as title, author, semester, pricing, and user rating. The system is built with server-side rendering to ensure consistent performance and straightforward maintainability.

⸻

Core Features
• Curated book recommendations organized by subject and semester
• Highlighting of highly rated books
• Reusable UI components for consistent rendering
• Clean and responsive layout
• Server-side rendering using EJS templates

⸻

Technology Stack

Layer Technology
Backend Node.js, Express
Templating EJS
Frontend HTML, CSS

⸻

Project Structure

StackLit/
│
├── views/
│ ├── index.ejs
│ ├── book.ejs
│ ├── search.ejs
│ └── partials/
│ ├── navbar.ejs
│ ├── footer.ejs
│ └── bookCard.ejs
│
├── public/
│ ├── css/
│ └── assets/
│
├── routes/
├── app.js
└── package.json

⸻

Setup Instructions

Clone the repository

git clone https://github.com/your-username/stacklit.git
cd stacklit

Install dependencies

npm install

Run the application

npm start

Access locally

http://localhost:3000

⸻

Implementation Notes
• Views are rendered using EJS with partials to maintain modularity
• Components such as bookCard.ejs are reused across pages
• Data is passed from Express routes into templates for rendering
• Folder structure separates layout, components, and static assets

⸻

Example Component Usage

<%- include('partials/bookCard', { book }) %>

⸻

Possible Extensions
• User accounts and personalization
• Bookmarking or wishlist functionality
• Recommendation logic based on user behavior
• External API integration for expanded book data

⸻

License

This project is released under the MIT License.

⸻

Author

Punith M
Information Science Engineering
:::
