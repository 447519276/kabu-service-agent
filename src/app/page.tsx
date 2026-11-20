/*
 * @Author: qinhao 447519276@qq.com
 * @Date: 2026-11-18 14:54:20
 * @LastEditors: qinhao 447519276@qq.com
 * @LastEditTime: 2026-11-20 16:44:55
 * @FilePath: \service-agent\src\app\page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Suspense } from "react";
import { refresh } from "next/cache";
import { connection } from "next/server";

type ChatMessage = {
    id: string;
    role: "user" | "assistant";
    content: string;
};

const history: ChatMessage[] = [
    { id: "1", role: "user", content: "你好" },
    { id: "2", role: "assistant", content: "你好，有什么可以帮你的吗？" },
];
export default function Home() {
    return (
        <div className="flex h-full flex-col">
            <div className="min-h-0 flex-3 overflow-y-auto border-b border-gray-900">
                <Suspense
                    fallback={
                        <p className="px-4 py-6 text-center text-sm text-neutral-500">
                            正在读取聊天记录…
                        </p>
                    }
                >
                    <ChatHistory />
                </Suspense>
            </div>
            <div className="flex-1">
                <ChatInput />
            </div>
        </div>
    );
}

async function ChatHistory() {
    await connection();

    if (history.length === 0) {
        return (
            <p className="px-4 py-6 text-center text-sm text-neutral-500">
                还没有聊天记录
            </p>
        );
    }

    return (
        <ul className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 py-6">
            {history.map((message) => (
                <li
                    key={message.id}
                    className={
                        message.role === "user"
                            ? "ml-auto max-w-[80%] rounded-2xl bg-neutral-900 px-4 py-2 whitespace-pre-wrap text-white"
                            : "mr-auto max-w-[80%] rounded-2xl bg-neutral-100 px-4 py-2 whitespace-pre-wrap text-neutral-900"
                    }
                >
                    {message.content}
                </li>
            ))}
        </ul>
    );
}

async function sendMessage(formData: FormData) {
    "use server";
    const message = formData.get("message");
    if (typeof message !== "string") return;

    const content = message.trim();
    if (!content) return;

    history.push({ id: crypto.randomUUID(), role: "user", content });
    refresh();
}
async function ChatInput() {
    return (
        <div>
            <form
                action={sendMessage}
                className="flex items-center gap-2 px-4 py-3"
            >
                <input
                    type="text"
                    name="message"
                    className="flex-1 rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-foreground placeholder:text-neutral-500 dark:border-neutral-700"
                    placeholder="输入你的问题"
                />
                <button
                    type="submit"
                    className="rounded-md bg-neutral-900 px-3 py-2 text-white"
                >
                    发送
                </button>
            </form>
        </div>
    );
}
