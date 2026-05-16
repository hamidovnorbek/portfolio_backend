import axios from 'axios';

function stringify(e) {
    try {
        if (typeof e == 'string') return e;
        const string = JSON.stringify(e, null, 2);
        if (string) return string.replace('/', '\n');
        return string;
    } catch (e) {
        console.log(e);
        return '';
    }
}

export async function sendBug(data) {
    try {
        if (process.env.NODE_ENV !== 'production') return;
        let message = encodeURI(stringify(data));
        if (message.length > 4096) message = message.slice(0, 4096);

        return await axios.get(process.env.TELEGRAM_URL.replace('{{message}}', message)).catch(async (e) => {
            await axios.get(process.env.EXTRA_TELEGRAM_URL.replace('{{message}}', message)).catch((e) => {});
        });
    } catch (error) {}
}
