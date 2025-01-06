import { PrismaClient } from "@prisma/client";
import express from "express"
import 'dotenv/config'
import authRoutes from "./routes/authRoutes";
var cors = require('cors')

const prisma = new PrismaClient()
const app = express()
app.use(cors())
app.use(express.json())
app.use('/auth', authRoutes)

async function main() {
    app.listen(3000, () => {
        console.log("Servidor rodando na porta 3000");
    });
    
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })