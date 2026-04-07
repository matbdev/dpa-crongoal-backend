import { Request, Response } from "express";

const express = require('express');
const app = express();
const PORT = 5000;

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/*
Importe o seu auth.routes.ts e anexe-o à instância principal do Hono.
Agora o seu servidor já sabe escutar as rotas de autenticação.
*/