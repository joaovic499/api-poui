import { NextFunction, Response, Request } from "express";
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const secretKey:any = process.env.SECRECT_KEY

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization;
    console.log('Authorization Header:', authHeader);

    if (!authHeader){
        res.json(401).json({
            token: false,
            error: true,
            message: "Token nao fornecido"
        })    
    }

    const parts = authHeader?.split(" ");

    if (parts?.length !== 2) {
        return res.json(401).json({
            error: true,
            message: "Tipo de Token Invalido"
        });
    }

    const [schema, token] = parts;

    if (schema !== "Bearer") {
        return res.status(401).json({
            error: true,
            message: "Bearer invalido"
        });
    }

    jwt.verify(token, secretKey, (err: any, decoded: any) => {
        if (err) {
            return res.status(401).json({
                error: true,
                message: "Token invalido ou expirado"
            });
        }

        req.user = decoded
        next();

    })
}