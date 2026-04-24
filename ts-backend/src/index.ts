import express from 'express';
import chatRoutes from './chatRoutes';

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use('/api', chatRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
