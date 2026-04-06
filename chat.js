export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { system, messages } = req.body;

  const GROQ_API_KEY = "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";
  const GROQ_MODEL = "llama-3.1-8b-instant";

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: "system", content: system }, ...messages],
        max_tokens: 400,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (data.choices && data.choices[0]) {
      res.status(200).json({ reply: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: "No response from Groq", details: data });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
