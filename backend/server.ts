import express from 'express';
import cors from 'cors';
import router from './routes';
import { db } from '../common/models';

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
}));

app.use('/api', router);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  db.sync();
  console.log(`Example app listening at http://localhost:${port}`);
});

export default app;
