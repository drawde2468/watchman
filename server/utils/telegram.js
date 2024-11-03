const TOKEN = process.env.TELEGRAM_KEY;
const CHANNEL_ID = process.env.CHANNEL_ID;

if (!TOKEN || !CHANNEL_ID) {
  throw new Error("Please provide TELEGRAM_KEY and CHANNEL_ID in .env file");
}

const TELEGRAM_API_URL = `https://api.telegram.org/bot${TOKEN}`;

const sendMessage = async (text) => {
  const url = `${TELEGRAM_API_URL}/sendMessage`;
  const body = {
    chat_id: CHANNEL_ID,
    text,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return response.json();
  } catch (err) {
    console.error(err);
  }
};

exports.sendMessage = sendMessage;
