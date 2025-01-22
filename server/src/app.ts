import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import countryRoutes from './routes/countryRoute';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(helmet());
app.use('/countries', countryRoutes);

// app.use((req, res, next) => {
//   res.setHeader(
//     'Content-Security-Policy',
//     "default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self';"
//   );
//   next();
// });

// app.use((req, res, next) => {
//   res.setHeader('X-XSS-Protection', '1; mode=block');
//   next();
// });

export default app;
