import mongoose from 'mongoose';
import { CommonException } from '../filter/common.error';
import { delay } from '../utils/delay.util';
import { sendBug } from '../utils/send-telegram.util';

export async function withTransaction(callback, retry = 0) {
    try {
        let result;
        const session = await mongoose.startSession();

        await session.withTransaction(async () => {
            result = await callback(session);
        }, {});

        await session.endSession();
        return result;
    } catch (error) {
        if (
            retry < 3 &&
            ((error instanceof CommonException && error.data?.code == 112 && error.data?.codeName == 'WriteConflict') ||
                (error?.code == 112 && error?.codeName == 'WriteConflict'))
        ) {
            console.error('TRANSACTION ERROR', error);
            sendBug({ RETRY_TRANSACTION: retry });
            await delay(200);
            return await withTransaction(callback, retry++);
        }
        throw error;
    }
}
