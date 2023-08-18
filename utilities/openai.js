import axios from "axios";

export const getResponseFromOpenAI = async (text) => {
  const OPENAI_API = "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";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${OPENAI_API}`,
  };
  const data = {
    prompt: text,
    model: "text-davinci-003",
    temperature: 0.7,
    max_tokens: 1000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: ["."],
  };
  try {
    const openai = await axios.post(
      "https://api.openai.com/v1/completions",
      data,
      { headers: headers }
    );
    return openai.data.choices[0].text.trim();
  } catch (err) {
    console.log(err);
  }
};
