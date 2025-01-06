import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

const secretKey: any = process.env.SECRET_KEY;

export const authorizeRole = (requiredRole: string) => {
    return ( req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization?.split(' ')['1'];
            console.log(token);

            if (!token) {
                return res.status(401).json({token: false, error: "Token náo fornecido"})
            }

            const decoded = jwt.verify(token, secretKey) as JwtPayload
            const userRole = decoded.role;
            console.log(userRole)

            if (userRole === requiredRole) {
                next();
            }        
                res.status(403).json({Role: false, error: "Acesso recusado"});
        
            } catch (error) {
                if (error instanceof jwt.JsonWebTokenError) {
                    return res.status(401).json({error: "Token invalido"})
                }

                console.error(error);
                return res.status(500).json({error: "Erro interno do servidor"});
        }  
    }
}

export const authorizeAdmin = authorizeRole('ADMIN');
export const authorizeUser = authorizeRole('USER');