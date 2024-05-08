import axios from "axios";

export const getResponseFromOpenAI = async (text) => {
  const data = {
    query:text
  }

  try {
    const openai = await axios.post(
      "https://openai-api-ikoma98.vercel.app/api",
      data,
    );
    return openai.data.result;
  } catch (err) {
    console.log(err);
  }
};
