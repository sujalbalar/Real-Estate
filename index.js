import express from 'express';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname,'public')));

const homePagePath = 'public/index.html';

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,homePagePath));
});

app.listen(9999, () => {
    console.log('Server running on 9999 port.');
})