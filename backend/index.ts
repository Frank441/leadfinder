process.loadEnvFile();

import express, { type Request, type Response } from "express";
import type { SharedTest } from "@leadfinder/shared/test";

const foo: SharedTest = "";

const port = process.env.PORT || 3001;

const app = express();

app.get('/', (req: Request, res: Response) => {
    res.send("Hello, world!");
});

app.listen(port, () => {
    console.log(`Server started on port ${port}\nGo to http://localhost:${port}`);
});