/*
 * @Author: qinhao 447519276@qq.com
 * @Date: 2026-11-18 15:52:54
 * @LastEditors: qinhao 447519276@qq.com
 * @LastEditTime: 2026-11-20 16:07:22
 * @FilePath: \service-agent\src\app\agent.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createAgent } from "langchain";
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import { ChatOpenAI } from "@langchain/openai";

// 创建持久化状态
const checkPointer = PostgresSaver.fromConnString(process.env.DATABASE_URL!);

// 初始化数据库表
await checkPointer.setup();

// 实例化模型
const model = new ChatOpenAI({
    configuration: {
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: process.env.BASE_URL,
    },
});

// 创建基础客服 Agent
export const customerServiceAgent = createAgent({
    model,
    tools: [],
    checkpointer: checkPointer,
    systemPrompt: `你是一个专业的客服，擅长回答客户的问题，解决客户的问题。
    行为准则：
    1.用友好、专业的语气回答用户问题
    2.如果不知道答案，诚实告知，不要编造
    3.保持回答简介，每次不超过3句话
    4.对于复杂问题，主动提出转接人工客服
    
    当前时间：${new Date().toLocaleString("zh-CN")}`,
});
