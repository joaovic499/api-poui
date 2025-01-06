import { PrismaClient, Role } from "@prisma/client"
import { Request, Response, NextFunction } from 'express';
var bcrypt  = require('bcryptjs')
import jwt, { JwtPayload } from 'jsonwebtoken'
import 'dotenv/config'

const prisma = new PrismaClient();
const secretKey:any = process.env.SECRET_KEY

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const {user, name, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        if (!role) {
            const newUser = await prisma.user.create({
                data: {
                    user,
                    name,
                    password: hashedPassword,
                    role: Role.USER
                }
            });

            console.log('Usuario criado com sucesso', newUser)
            res.status(201).json({message: 'Usuário criado com sucesso', newUser});
        }

        else {
            const newUser = await prisma.user.create({
                data: {
                    user,
                    name,
                    password: hashedPassword,
                    role: Role.ADMIN
                }
            });

            console.log('Usuario ADMIN criado com sucesso', newUser)
            res.status(201).json({message: 'Usuário ADMIN criado com sucesso', newUser});
        }
    } catch (error) {
        console.error("Erro ao cirar o usuario: ", error);
        res.status(500).send("Erro ao criar o usuario")
    }
}

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { user, password } = req.body;

    try {
        if (!user || !password) {
            res.status(400).json({ message: "Erro ao logar" });
            return;
        }

        const logar = await prisma.user.findUnique({
            where: { user },
        });

        if (!logar) {
            res.status(404).json({ message: "Usuário não cadastrado" });
            return;
        }

        const validaSenha = await bcrypt.compare(password, logar.password);
        
        if (!validaSenha) {
            res.status(403).json({ message: "Senha incorreta" });
            return;
        }

        const token = jwt.sign(
            { id: logar.id, name: logar.name, role: logar.role }, secretKey,  { expiresIn: '1h' }
        );

        res.json({ message: "Login feito com sucesso", token, user: logar });
    } catch (err) {
        console.error(err);
        next(err); 
    }
};