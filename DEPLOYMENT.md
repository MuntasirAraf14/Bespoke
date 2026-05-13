# 🚀 Bespoke E-commerce - Deployment Guide

This guide explains how to host your full-stack website permanently.

## 1. Backend Deployment (Render)

Recommended for ease of use and free tier availability.

1.  **Create a Account:** Go to [render.com](https://render.com) and sign up with GitHub.
2.  **New Web Service:** Select "New" > "Web Service" and connect your `Bespoke` repository.
3.  **Config:**
    - **Root Directory:** `backend`
    - **Build Command:** `npm install`
    - **Start Command:** `npm start`
4.  **Environment Variables:** Add all variables from your `backend/.env` (e.g., `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, etc.).
5.  **Allowed Origins:** Ensure `ALLOWED_ORIGINS` includes your GitHub Pages URLs (e.g., `https://MuntasirAraf14.github.io`).

## 2. Frontend & Admin Deployment (GitHub Pages)

### Frontend

1.  **Install Helper:** `cd frontend && npm install gh-pages --save-dev` (if not already there).
2.  **Update Config:** Ensure `.env` in `frontend` has `VITE_BACKEND_URL` pointing to your Render URL.
3.  **Deploy:** Run `npm run deploy`.

### Admin Panel

1.  **Install Helper:** `cd admin && npm install gh-pages --save-dev`.
2.  **Update Config:** Ensure `VITE_BACKEND_URL` points to your Render URL.
3.  **Deploy:** Run `npm run deploy`.

---

## 3. Database (MongoDB Atlas)

Ensure your MongoDB Atlas cluster allows connections from "Anywhere" (0.0.0.0/0) or add the IP addresses provided by Render to the IP Access List.

## 4. Environment Checklist

| Variable              | Value Source         | Required             |
| :-------------------- | :------------------- | :------------------- |
| `MONGODB_URI`         | MongoDB Atlas        | Yes                  |
| `JWT_SECRET`          | Random String        | Yes                  |
| `SSLCOMMERZ_STORE_ID` | SSLCommerz Dashboard | Yes                  |
| `VITE_BACKEND_URL`    | Render Service URL   | Yes (Frontend/Admin) |
