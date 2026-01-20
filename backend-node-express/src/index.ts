import "reflect-metadata";
import { buildOpenAPIDocument } from "./docs/openapi.js";
import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { handlerError } from "./middlewares/errorMiddleware.js";
import { AppDataSource } from './config/datasource.js';

import userRouter, { authRouter } from './modules/users/user.routes.js';
import eventRouter from "./modules/event/event.routes.js";
import categoryRouter from "./modules/category/category.routes.js";
import inscriptionRouter from "./modules/inscription/inscription.routes.js";

const app: Application = express();
const PORT: number = 3001;

app.use(morgan('tiny'));
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

AppDataSource.initialize()
    .then(() => console.log("Database connected"))
    .catch((err) => console.error("Error connecting database:", err));

const openApiDocs = buildOpenAPIDocument();
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocs));

app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/eventos', eventRouter);
app.use('/categorias', categoryRouter);
app.use('/inscricoes', inscriptionRouter);

app.get('/', (req: Request, res: Response) => {
    res.send({ message: 'API rodando com sucesso!' });
});

app.use(handlerError);

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});