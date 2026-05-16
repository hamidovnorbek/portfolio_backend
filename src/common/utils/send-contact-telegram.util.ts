import axios from 'axios';

export async function sendContactTelegram(data: {
    sender_name: string;
    sender_email: string;
    message: string;
}) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) return;

    const text = [
        '*New Contact Message*',
        `*Name:* ${escapeMarkdown(data.sender_name)}`,
        `*Email:* ${escapeMarkdown(data.sender_email)}`,
        '',
        `*Message:*`,
        escapeMarkdown(data.message),
    ].join('\n');

    try {
        await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            chat_id: chatId,
            text,
            parse_mode: 'Markdown',
        });
    } catch (error) {
        console.error('Telegram contact notification failed', error?.message || error);
    }
}

function escapeMarkdown(value: string) {
    return (value || '').replace(/[_*`\[\]]/g, (m) => `\\${m}`);
}
