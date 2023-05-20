
import express from 'express';
import { processFirstJob } from './controllers/batch';

const rawBodyParser = function (request: express.Request, response: express.Response, buffer: Buffer, encoding: BufferEncoding) {
    if (buffer && buffer.length) {
      (request as any).rawBody = buffer.toString(encoding || 'utf8');
    }
  }
  
const app = express();
app.use(express.json({ verify: rawBodyParser}));

app.get('/', (req, res) => {
    res.status(200).json({ status: `up` });
});
app.post('/create-first-batch', processFirstJob);

const port = 3000;

app.listen(port, () => {
    console.log(`Cloud task tutorial listening on port ${port}`)
  })

