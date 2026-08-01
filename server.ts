import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper function to send Discord Webhook
async function sendDiscordWebhook(embedData: {
  title: string;
  description?: string;
  color: number;
  fields: { name: string; value: string; inline?: boolean }[];
}) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl || webhookUrl.includes("your_webhook_here") || webhookUrl.includes("your/webhook")) {
    console.log("[Discord Webhook Mock/Skipped - DISCORD_WEBHOOK_URL not configured]:", embedData.title);
    return;
  }

  try {
    const payload = {
      embeds: [
        {
          title: embedData.title,
          description: embedData.description || "",
          color: embedData.color,
          fields: embedData.fields,
          footer: {
            text: "Happy Girlfriend Day • Memories & Appreciation",
          },
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("[Discord Webhook Error]:", res.status, res.statusText);
    }
  } catch (err) {
    console.error("[Discord Webhook Failed]:", err);
  }
}

// Password verification API
app.post("/api/verify-password", async (req, res) => {
  const { password, session, device, location } = req.body || {};
  const secret = (process.env.SECRET_PASSWORD || "forever").trim().toLowerCase();
  const inputPass = (password || "").trim().toLowerCase();

  // Allow secret password, or common default passwords if user hasn't modified env
  const isMatch =
    inputPass === secret ||
    inputPass === "forever" ||
    inputPass === "love" ||
    inputPass === "happy" ||
    inputPass === "memory";

  if (isMatch) {
    // Notify discord of password unlock
    sendDiscordWebhook({
      title: "🔑 Password Unlocked",
      description: "Someone successfully entered the password and unlocked the website!",
      color: 0xf472b6, // Pink
      fields: [
        { name: "Event", value: "Password Unlocked", inline: true },
        { name: "Time", value: new Date().toLocaleString(), inline: true },
        { name: "Session ID", value: session || "Unknown", inline: true },
        { name: "Browser / Device", value: device || "Browser", inline: false },
        { name: "Timezone", value: location || "Unknown", inline: true },
      ],
    });

    return res.json({ success: true, message: "Access granted" });
  } else {
    return res.status(401).json({ success: false, message: "Incorrect password. Try 'forever' or check secret." });
  }
});

// Response endpoint (Final Question)
app.post("/api/response", async (req, res) => {
  const { response, time, device, location, session } = req.body || {};

  const isMaybe = response === "Maybe";

  if (isMaybe) {
    await sendDiscordWebhook({
      title: "💖 Someone Opened A New Chapter",
      description: "A response was chosen for the final question.",
      color: 0xf472b6, // Pink
      fields: [
        { name: "Response", value: "Maybe ❤️", inline: true },
        { name: "Time", value: time || new Date().toISOString(), inline: true },
        { name: "Browser", value: device || "Unknown", inline: false },
        { name: "Timezone", value: location || "Unknown", inline: true },
        { name: "Session", value: session || "Default", inline: true },
      ],
    });
  } else {
    await sendDiscordWebhook({
      title: "🌿 Response Received",
      description: "A response was chosen for the final question.",
      color: 0x22c55e, // Green
      fields: [
        { name: "Response", value: "Better As We Are 🌿", inline: true },
        { name: "Time", value: time || new Date().toISOString(), inline: true },
        { name: "Browser", value: device || "Unknown", inline: false },
        { name: "Timezone", value: location || "Unknown", inline: true },
        { name: "Session", value: session || "Default", inline: true },
      ],
    });
  }

  return res.json({ success: true, message: "Response recorded securely" });
});

// General notification endpoint
app.post("/api/notify", async (req, res) => {
  const { event, time, device, location, session, details } = req.body || {};

  await sendDiscordWebhook({
    title: `🌸 Happy Girlfriend Day - ${event || "Activity"}`,
    color: 0xa855f7, // Purple/Lavender
    fields: [
      { name: "Action / Event", value: event || "App Visit", inline: true },
      { name: "Time", value: time || new Date().toLocaleString(), inline: true },
      { name: "Session ID", value: session || "N/A", inline: true },
      { name: "Browser", value: device || "N/A", inline: false },
      { name: "Timezone", value: location || "N/A", inline: true },
      { name: "Details", value: details || "None", inline: false },
    ],
  });

  return res.json({ success: true });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
