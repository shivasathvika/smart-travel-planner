import { mkdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

try {
    await mkdir(join(__dirname, 'logs'));
    console.log('Logs directory created successfully');
} catch (error) {
    if (error.code === 'EEXIST') {
        console.log('Logs directory already exists');
    } else {
        console.error('Error creating logs directory:', error);
    }
}
