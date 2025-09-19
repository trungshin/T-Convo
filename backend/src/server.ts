import 'tsconfig-paths/register';
import http from 'http';
import { createApp } from './app';
import { connectDB } from '@config/db';
import { env } from '@config/env';
import { initSocket } from '@sockets/index';

const app = createApp();
const server = http.createServer(app);
initSocket(server);

const startServer = async () => {
  await connectDB();

  const port = env.NODE_ENV === 'prod' ? process.env.PORT : Number(env.LOCAL_PORT);
  server.listen(port, () => console.log(`Server listening on ${port}`));
};

startServer().catch(err => { console.error('Failed to start', err); process.exit(1); });
