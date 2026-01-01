"use server";

import { prisma } from "@/lib/prisma";

// Define an interface for better type safety
interface SendMessageProps {
  name?: string;
  content: string;
  color?: string;
}

export const sendMessage = async (data: SendMessageProps) => {
  try {
    // Basic validation
    if (!data.content || data.content.trim() === "") {
      return { success: false, error: "Message content cannot be empty" };
    }

    const newMessage = await prisma.message.create({
      data: {
        name: data.name,
        content: data.content,
        color: data.color,
      },
    });

    return { success: true, message: newMessage };
  } catch (error) {
    console.error("Failed to send message:", error);
    return { success: false, error: "Failed to save message to database" };
  }
};

export const getMessages = async () => {
  try {
    return await prisma.message.findMany({
      take: 80,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    return [];
  }
};

export const clearAllMessages = async (password: string) => {
  // Replace 'admin123' with your actual secret password
  if (password !== "123456") {
    throw new Error("Unauthorized: Invalid System Override Key");
  }

  try {
    await prisma.message.deleteMany({});
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};
