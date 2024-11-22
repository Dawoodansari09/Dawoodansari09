// clearPlugin.js

module.exports = {
    name: "clearPlugin",
    description: "A plugin to clear messages in personal and group chats.",
    version: "1.0.0",
    author: "aadil",
    commands: [".clear"],

    async execute(client, message, args) {
        const chatId = message.key.remoteJid; // Get the chat ID from the incoming message
        const isGroup = chatId.endsWith("@g.us");

        // Command: .clear
        if (args[0] === "all" && isGroup) {
            // Clear all messages in the group
            await clearGroup(client, chatId, args.slice(1));
        } else if (args[0] === "all" && !isGroup) {
            // Clear all messages in personal chats
            await clearPersonalChats(client, args.slice(1));
        } else {
            // Clear messages for the specific chat
            await clearChat(client, chatId);
        }
    },
};

// Function to clear all messages in a specific chat
async function clearChat(client, chatId) {
    try {
        await client.chatModify({ clear: true }, chatId);
        console.log(`Messages cleared in chat: ${chatId}`);
    } catch (error) {
        console.error(`Failed to clear messages in chat: ${chatId}`, error);
    }
}

// Function to clear messages for all personal chats
async function clearPersonalChats(client, exclusions = []) {
    try {
        const chats = await client.getChats(); // Get all chats
        for (const chat of chats) {
            if (!chat.id.endsWith("@g.us") && !exclusions.includes(chat.id)) {
                await client.chatModify({ clear: true }, chat.id);
                console.log(`Messages cleared in personal chat: ${chat.id}`);
            }
        }
    } catch (error) {
        console.error("Failed to clear messages in personal chats:", error);
    }
}

// Function to clear messages for all groups or specific groups
async function clearGroup(client, chatId, exclusions = []) {
    try {
        const chats = await client.getChats(); // Get all chats
        for (const chat of chats) {
            if (chat.id.endsWith("@g.us") && !exclusions.includes(chat.id)) {
                await client.chatModify({ clear: true }, chat.id);
                console.log(`Messages cleared in group chat: ${chat.id}`);
            }
        }
    } catch (error) {
        console.error("Failed to clear messages in group chats:", error);
    }
}
