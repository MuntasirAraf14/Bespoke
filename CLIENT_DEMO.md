# 🤝 Client Review Guide (High Performance)

Localtunnel can sometimes be slow. If you want a **faster, high-performance** demo, use `untun` (from the Nitro team).

## ⚡ Option 1: Untun (Faster & No Password)

### 1. Share your Backend

Open a new terminal and run:
`npx untun tunnel 4000`

- Copy the **Tunnel URL** (e.g., `https://xxxx.lhr.life`).
- Update your `frontend/.env` and `admin/.env` `VITE_BACKEND_URL` with this.

### 2. Share your Frontend

Open a new terminal and run:
`npx untun tunnel 5173`

- Share this URL with your client.

### 3. Share your Admin Panel

Open a new terminal and run:
`npx untun tunnel 5174`

- **Note:** Ensure you use port **5174** for the Admin Panel.

---

## 🛠️ Performance Tips

- **Restart Servers:** Always restart your `npm run dev` and `npm run server` after changing the `.env` file.
- **Close Extra Tunnels:** If it still feels slow, close any old `localtunnel` windows you have open.
- **Direct Link:** `untun` links generally don't require the "Tunnel Password" screen, making it much smoother for clients.
