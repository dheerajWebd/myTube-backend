import asyncHandler from "../utils/ansicHandler.js";
import { ErrorFormater } from "../utils/ErrorFormate.js";
import Groq from "groq-sdk";
import successResponse from "../utils/successResponse.js";
import { json } from "express";

export const chatGPTController = asyncHandler(async (req, res, next) => {
  // const { prompt } = req.body;
  const { prompt } = req.query;

  if (!prompt) throw new ErrorFormater("prompt is required", "", 400);

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  async function multiTurnConversation() {
    // Initial conversation with system message and first user input
    const initialMessages = [
      {
        role: "system",
        content: `
You are an expert YouTube SEO AI assistant.

Your task is to generate viral and highly engaging YouTube content details based on the user's topic, title.

Always return response in valid JSON object format only.

Required Output Fields:

1. video_title  
- Highly clickable, emotional, curiosity-based title
- SEO friendly
- Maximum engagement focused

2. video_description  
- 500 to 1000 characters
- Professional, attractive, engaging
- Include call to action
- Include 5 to 10 relevant hashtags

3. video_tags  
- Array format only
- SEO optimized
- Relevant keywords
- High search volume, low competition
- Relevant to video content and title
- Include trending tags if relevant
- Avoid irrelevant or misleading tags or duplicate tags
- some and high quality or more sort tag or less some long tail tag 
- Total approx 1000 characters max

4. video_category  
- Array format only
- Relevant niche/category

5. keywords
- Array format only
- Relevant niche/category

6. optional_fields:
- target_audience
- best_upload_time
- thumbnail_text
- thumbnail_idea
- keywords
- viral_score

Important Rules:
- Response must be JSON only
- No explanation text
- No markdown
- No extra notes
- Creative and high CTR focused output
- Modern YouTube algorithm optimized
`,
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    // First request - creates cache for system message
    const firstResponse = await groq.chat.completions.create({
      messages: initialMessages,
      model: "qwen/qwen3-32b",
      stream: true,
      temperature: 0.7,
    });

    // console.log("First response:", firstResponse.choices[0].message.content);
    // console.log("Usage:", firstResponse.usage);
    // console.log("full responce:", firstResponse);

    // // Continue conversation - system message and previous context will be cached
    // const conversationMessages = [
    //   ...initialMessages,
    //   firstResponse.choices[0].message,
    //   {
    //     role: "user",
    //     content:
    //       "Can you give me a simple example of how quantum superposition works?",
    //   },
    // ];

    // const secondResponse = await groq.chat.completions.create({
    //   messages: conversationMessages,
    //   model: "openai/gpt-oss-120b",
    // });

    // console.log("Second response:", secondResponse.choices[0].message.content);
    // console.log("Usage:", secondResponse.usage);

    // // Continue with third turn
    // const thirdTurnMessages = [
    //   ...conversationMessages,
    //   secondResponse.choices[0].message,
    //   {
    //     role: "user",
    //     content: "How does this relate to quantum entanglement?",
    //   },
    // ];

    // const thirdResponse = await groq.chat.completions.create({
    //   messages: thirdTurnMessages,
    //   model: "openai/gpt-oss-120b",
    // });

    // console.log("Third response:", thirdResponse.choices[0].message.content);
    // console.log("Usage:", thirdResponse.usage);
    return firstResponse;
  }

  multiTurnConversation().catch(console.error);
  const data = await multiTurnConversation();

  for await (const chunk of data) {
    console.log(chunk);
    const text = chunk.choices?.[0]?.delta?.content || "";

    if (text) {
      res.write(text);
    }
  }
  res.end();
});
