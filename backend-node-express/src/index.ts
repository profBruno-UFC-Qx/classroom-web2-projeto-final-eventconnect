import "reflect-metadata";
import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { buildOpenAPIDocument } from "./docs/openapi.js";
import { handlerError } from "./middlewares/errorMiddleware.js";
import { AppDataSource } from './config/datasource.js';
import userRouter from './modules/users/user.routes.js';

const app: Application = express();
const PORT: number = 3001;

app.use(morgan('tiny'));
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

AppDataSource.initialize()
    .then(() => console.log("📦 Database connected"))
    .catch((err) => console.error("❌ Error connecting database:", err));

const openApiDocs = buildOpenAPIDocument();
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocs));

app.use('/users', userRouter);

app.get('/', (req: Request, res: Response) => {
    res.send({ message: 'API rodando com sucesso!' });
});

app.use(handlerError);

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});