import { Logger } from '@nestjs/common';
import { ConfigService } from 'src/common/config/config.service';
import { connectToDB } from 'src/common/db/connect.db';
import { sendBug } from 'src/common/utils/send-telegram.util';

(async () => {
    await connectToDB(new ConfigService());
    Logger.log('MIGRATION STARTING...');
    console.log('MIGRATION STARTING...');
    setTimeout(async () => {
        try {
            Logger.log('MIGRATION DONE');
            console.log('MIGRATION DONE');
        } catch (error) {
            console.log(error);
            sendBug({ message: 'Migration error', error: error });
        }
    }, 4000);
})();
