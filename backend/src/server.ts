import http from 'http';
import { createApp } from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

const app = createApp();
const server = http.createServer(app);

const start = async () => {
  await connectDB();
  server.listen(Number(env.PORT), () => console.log(`Server listening on ${env.PORT}`));
};

start().catch(err => { console.error('Failed to start', err); process.exit(1); });
