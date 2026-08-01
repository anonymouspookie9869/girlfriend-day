import { getDeviceInfo, getSessionId } from "./storage";

export interface DiscordEmbedData {
  title: string;
  description?: string;
  color?: number;
  fields: { name: string; value: string; inline?: boolean }[];
}

// Direct client-side discord sender as robust fallback
export async function sendDirectDiscordWebhook(embedData: DiscordEmbedData): Promise<boolean> {
  const webhookUrl =
    (import.meta.env.VITE_DISCORD_WEBHOOK_URL as string) ||
    (import.meta.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL as string) ||
    "";

  if (!webhookUrl || webhookUrl.includes("your_webhook_here") || webhookUrl.includes("your/webhook")) {
    return false;
  }

  const cleanUrl = webhookUrl.trim().replace(/^["']|["']$/g, "");

  try {
    const payload = {
      embeds: [
        {
          title: embedData.title,
          description: embedData.description || "",
          color: embedData.color || 0xf472b6,
          fields: embedData.fields,
          footer: {
            text: "Happy Girlfriend Day • Memories & Appreciation",
          },
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const res = await fetch(cleanUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return res.ok;
  } catch (err) {
    console.error("Direct Discord webhook failed:", err);
    return false;
  }
}

export async function notifyEvent(event: string, details: string = "None"): Promise<void> {
  const session = getSessionId();
  const { device, location } = getDeviceInfo();
  const time = new Date().toLocaleString();

  const payload = {
    event,
    time,
    device,
    location,
    session,
    details,
  };

  try {
    const res = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Server status ${res.status}`);
    }
  } catch (err) {
    console.warn("Server notify endpoint unreachable, sending directly from client:", err);
    await sendDirectDiscordWebhook({
      title: `🌸 Happy Girlfriend Day - ${event}`,
      color: 0xa855f7,
      fields: [
        { name: "Action / Event", value: event, inline: true },
        { name: "Time", value: time, inline: true },
        { name: "Session ID", value: session || "N/A", inline: true },
        { name: "Browser", value: device || "N/A", inline: false },
        { name: "Timezone", value: location || "N/A", inline: true },
        { name: "Details", value: details, inline: false },
      ],
    });
  }
}

export async function notifyPasswordUnlocked(): Promise<void> {
  const session = getSessionId();
  const { device, location } = getDeviceInfo();
  
  await sendDirectDiscordWebhook({
    title: "🔑 Password Unlocked",
    description: "Someone successfully entered the password and unlocked the website!",
    color: 0xf472b6,
    fields: [
      { name: "Event", value: "Password Unlocked", inline: true },
      { name: "Time", value: new Date().toLocaleString(), inline: true },
      { name: "Session ID", value: session || "Unknown", inline: true },
      { name: "Browser / Device", value: device || "Browser", inline: false },
      { name: "Timezone", value: location || "Unknown", inline: true },
    ],
  });
}

export async function notifyResponseChosen(choice: string): Promise<void> {
  const session = getSessionId();
  const { device, location } = getDeviceInfo();
  const isMaybe = choice === "Maybe";

  await sendDirectDiscordWebhook({
    title: isMaybe ? "💖 Someone Opened A New Chapter" : "🌿 Response Received",
    description: "A response was chosen for the final question.",
    color: isMaybe ? 0xf472b6 : 0x22c55e,
    fields: [
      { name: "Response", value: isMaybe ? "Maybe ❤️" : choice, inline: true },
      { name: "Time", value: new Date().toLocaleString(), inline: true },
      { name: "Browser", value: device || "Unknown", inline: false },
      { name: "Timezone", value: location || "Unknown", inline: true },
      { name: "Session", value: session || "Default", inline: true },
    ],
  });
}
