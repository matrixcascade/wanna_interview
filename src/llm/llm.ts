import OpenAI from 'openai';
import key from '@/config/key';
import { system_prompt } from '@/config/system_prompt';
class LLMService {


 private messages: {
  role: "system" | "user" | "assistant"
  content: string
}[] = [
  {
    role: "system",
    content: system_prompt
  }
]

  private gpt_response_message = '';
  private message = '';
  private openai: OpenAI | null = null;

  async init()
  {
    try{
    this.openai = new OpenAI(
    {
        baseURL: 'https://api.deepseek.com',
        apiKey: key.OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
    }
    );
    } catch(error)
    {
      console.error("Error initializing OpenAI client:", error);
    }
  }

  async send(message_content: string): Promise<string> //发送消息获得应答,如果没有初始化会先初始化
  {
    if(!this.openai)
    {
      try
      {
        await this.init();
      }
      catch(error)
      {
        console.error("Error initializing OpenAI client:", error);
        return "无法连接到服务器，请稍后再试。";
      }
    }
    try
    {
      this.messages.push({
        role: "user",
        content: message_content
      });
      if(!this.openai)
      {
        throw new Error("OpenAI client is not initialized.");
      }
      const completion = await this.openai.chat.completions.create({
      messages: this.messages,
      model: "deepseek-chat",
     });

      this.gpt_response_message = completion.choices?.[0]?.message?.content ?? '';
      this.messages.push({
        role: "assistant",
        content: this.gpt_response_message
      });

    }
    catch(error)
    {
      console.error("Error during OpenAI API call:", error);
      this.gpt_response_message = "无法连接到服务器，请稍后再试。";
    }
    finally{
      this.message = '';
    }
    return this.gpt_response_message;
  }

  resetConversation()
  {
    this.messages = [
      {
        role: "system",
        content: system_prompt
      }
    ];
    this.gpt_response_message = '';
    this.message = '';
  }
}

export const llmService = new LLMService();



