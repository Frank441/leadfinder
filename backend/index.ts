import cors from "cors";
import authRouter from "@/modules/auth/auth.routes";
import estadosRouter from "@/modules/estados/estados.routes";
import cuitRouter    from "@/modules/cuit/cuit.routes";
import express, { type Request, type Response } from "express";

for (const key of ['DB_USER', 'DB_PASSWORD', 'DB_NAME', 'DB_PORT', 'JWT_SECRET']) {
    if (!process.env[key]) throw new Error(`${key} is not set in .env`);
}

const port = process.env.PORT || 3001;

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth',    authRouter);
app.use('/api/v1/estados', estadosRouter);
app.use('/api/v1/cuit',    cuitRouter);

app.listen(port, () => {
    console.log(`Server started on port ${port}\nGo to http://localhost:${port}`);
});