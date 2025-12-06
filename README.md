# Retail Sales Management System - TruEstate SDE Intern Assignment

## 1. Project Overview
This project is a high-performance **Retail Sales Dashboard** developed using the **MERN Stack** (MongoDB, Express, React, Node.js). It is designed to handle large-scale transaction datasets with sub-second response times. The system features advanced server-side data processing, a modular frontend architecture, and professional UI/UX design matching strict Figma specifications.

**Live Demo:** [Insert Vercel Link Here]

---

## 2. System Architecture

### Backend Architecture (Node.js + Express + MongoDB)
The backend follows the **Controller-Service-Repository** pattern to ensure separation of concerns and maintainability.
* **Controller Layer:** Handles HTTP requests, input validation, and response formatting.
* **Service Layer:** Contains the core business logic (pagination math, filtering rules).
* **Data Layer (Mongoose):** Manages database interactions using optimized schemas and indexes.

### Frontend Architecture (React + Vite + Tailwind)
The frontend is built using **Atomic Design Principles**, separating logic (Hooks/Services) from presentation (Components).
* **State Management:** React `useState` and `useEffect` hooks manage the synchronization between UI filters and URL query parameters.
* **Performance:** Implements **Debouncing** (400ms) on search inputs to prevent API overloading.
* **API Layer:** Centralized Axios instance with interceptors for error handling.

---

## 3. Complexity Analysis (Engineering Decisions)

We focused heavily on **Time and Space Complexity** optimization to ensure the system scales.

### Time Complexity
* **Search Operations:** $O(\log N)$
    * We utilized MongoDB **Text Indexes** on `Customer Name` and `Phone`. This allows the database to use B-Tree lookups instead of full collection scans ($O(N)$).
* **Filtering & Sorting:** $O(\log N)$
    * Implemented **Compound Indexes** (e.g., `Region + Date`) following the **ESR Rule** (Equality, Sort, Range). This ensures that sorting happens in memory without blocking the CPU.
* **Pagination:** $O(1)$ relative to page size.
    * We use `.skip()` and `.limit()`. While deep pagination has costs, for the scope of this dashboard (accessing first ~100 pages), the retrieval time is constant.

### Space Complexity
* **Data Fetching:** $O(K)$ (where K is page limit, e.g., 10)
    * We used Mongoose **`.lean()` queries**. This bypasses the overhead of hydrating full Mongoose Documents, returning plain JSON objects instead. This reduces backend memory usage by approximately **5x**.
* **Data Seeding:** $O(1)$ Memory
    * The seeder script uses **Node.js Streams** to read the CSV file line-by-line. This allows processing millions of records without crashing the Heap memory (RAM).

---

## 4. API Documentation

The backend exposes a RESTful API designed for flexibility.

### **1. Fetch Transactions (Main Endpoint)**
Used to populate the main table and handle all search/filter/sort operations.

* **Endpoint:** `GET /api/transactions`
* **Query Parameters:**

| Parameter | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `page` | `Number` | Current page number | `1` |
| `limit` | `Number` | Items per page | `10` |
| `search` | `String` | Search by Name or Phone | `Neha` |
| `region` | `String` | Filter by Region (CSV) | `North,East` |
| `gender` | `String` | Filter by Gender | `Male` |
| `category` | `String` | Filter by Product Category | `Clothing` |
| `minAge` | `Number` | Minimum Age | `25` |
| `maxAge` | `Number` | Maximum Age | `40` |
| `sortBy` | `String` | Field to sort by | `date` |
| `order` | `String` | Sort direction | `asc` or `desc` |

### **2. Fetch Filter Options**
Used to dynamically populate dropdown menus on the frontend.

* **Endpoint:** `GET /api/transactions/options`
* **Response:** JSON object containing unique arrays of Regions, Categories, Tags, and Payment Methods derived from the database.

---

## 5. Frontend Logic & Data Flow

Here is how the Frontend components interact with the API:

### **Sector 1: The Navbar (Search)**
* **Action:** User types in the search bar.
* **Logic:** A custom debounce function waits for **400ms** of inactivity.
* **API Call:** Triggers `GET /api/transactions?search=UserQuery`.
* **Result:** The table updates instantly without reloading the page.

### **Sector 2: The Filter Bar**
* **Action:** User selects "North" from Region and "Male" from Gender.
* **Logic:** The state updates to `{ region: 'North', gender: 'Male', page: 1 }`. We reset to Page 1 to avoid empty views.
* **API Call:** Triggers `GET /api/transactions?region=North&gender=Male`.
* **Result:** Data is filtered server-side to ensure accuracy.

### **Sector 3: The Pagination Controls**
* **Action:** User clicks "Next" or a page number (e.g., 2).
* **Logic:** Updates the `page` state variable.
* **API Call:** Triggers `GET /api/transactions?page=2&limit=10`.
* **Result:** Fetches the next "Chunk" of data using MongoDB `skip` logic.

### **Sector 4: Stats Panel**
* **Action:** Any change in Search or Filter.
* **Logic:** The frontend calculates totals (Units Sold, Total Amount) based on the **currently fetched dataset**.
* **Note:** Displays dynamic count (e.g., "(10 SRs)") representing the rows currently visible/fetched.

---

## 6. Setup Instructions

### Prerequisites
* Node.js (v16+)
* MongoDB URI (Local or Atlas)

### Step 1: Backend Setup
```bash
cd backend
npm install

# Create .env file
echo "PORT=5000" > .env
echo "MONGO_URI=your_mongodb_connection_string" >> .env

# Import Data (Crucial Step)
node seed.js

# Run Server
npm start