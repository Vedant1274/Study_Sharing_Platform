# Study Sharing Platform 📚

A full-stack web application built with the MERN stack (MongoDB, Express, React, Node.js) that allows students to easily upload, discover, and download study materials. 

## Features 🚀
- **Upload Materials:** Seamlessly upload study resources (PDFs, images, documents) with strict file type validation.
- **Browse & Search:** Search for materials by title or filter through recent uploads to quickly find what you need.
- **Download Resources:** Download study materials directly to your device with a single click.
- **Manage Content:** Users can easily delete materials that are no longer needed.
- **Modern UI/UX:** Clean, responsive, and beginner-friendly interface with loading states, helpful conditional messages, and dynamic file type labels.

## Technologies Used 🛠️
- **Frontend:** React.js, Vite, Vanilla CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose)
- **File Handling:** Multer

---

## Getting Started 🏁

Follow these steps to set up the project locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or a local MongoDB instance).

### 1. Clone the Repository
```bash
git clone https://github.com/Vedant1274/Study_Sharing_Platform.git
cd Study_Sharing_Platform
```

### 2. Install Dependencies

**For the Backend:**
```bash
cd server
npm install
```

**For the Frontend:**
```bash
cd ../client
npm install
```

### 3. Environment Variables (.env) ⚠️ IMPORTANT

This project requires a connection to a MongoDB database to store the material metadata. You must create a `.env` file in the `server` directory before running the application.

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Create a file named `.env` in the root of the `server` folder.
3. Add the following variables to your `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string_here
```

**How to get your MongoDB Atlas Connection String:**
1. Log in to your [MongoDB Atlas dashboard](https://cloud.mongodb.com/).
2. Create a new Cluster and Database (e.g., `StudyPlatform`).
3. Under your cluster, click **Connect** -> **Connect your application**.
4. Copy the connection string.
5. Replace `<password>` with your database user's password.
6. **Crucial Step:** Make sure to specify your database name right before `?appName=...` in the URI. 
   *(Example: `mongodb+srv://user:password@cluster.mongodb.net/StudyPlatform?appName=Cluster0`)*

### 4. Run the Application

You need to run both the frontend and backend servers simultaneously.

**Start the Backend Server:**
Open a terminal, navigate to the `server` folder, and run:
```bash
cd server
npm run dev
# or: nodemon server.js
```
*You should see a message saying "MongoDB Connected".*

**Start the Frontend Server:**
Open a *new* terminal, navigate to the `client` folder, and run:
```bash
cd client
npm run dev
```

### 5. Open the App
The frontend will typically run on `http://localhost:5173`. Open this URL in your browser to start using the Study Sharing Platform!