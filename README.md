# Artist Content Approval Dashboard

A full-stack application for artists to submit content, track metrics, and for admins to review and approve submissions. Built with **React**, **Firebase Authentication**, **Node.js/Express**, and **MongoDB**, deployed on **Vercel**.

---

## Features

- Artist registration & login using Firebase Authentication
- Artists can upload content (link or file)
- Track content metrics (views, revenue)
- Admin dashboard to review and approve content
- Role-based access control: Artist vs Admin
- JWT/Firebase token authentication for secure API access

---

## Technologies Used

- Frontend: React, React Hook Form, React Query, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB Atlas
- Authentication: Firebase Auth & Firebase Admin SDK
- Deployment: Vercel
- Axios for HTTP requests

---

## Prerequisites

- Node.js >= 18
- Firebase project with web app setup
- MongoDB Atlas cluster
- `.env` file with the following variables:

```env
PORT=3000
DB_USER=yourMongoDBUser
DB_PASS=yourMongoDBPassword
FB_SERVICE_KEY=base64_encoded_firebase_service_account

## install and run
- git clone https://github.com/Tanvir-173/artist-content-approval-revenue-tracking-client.git

- npm run dev (localhost)