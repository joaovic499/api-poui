import { PrismaClient, Veiculo } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

export const criarVeiculo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const {chassi, modelo, cor, estado, armazem, procedencia, userId, marca} = req.body

    try {
        if (!chassi || !modelo || !cor || !estado || !armazem || !procedencia || !marca ) {
        res.status(400).json({message: "Erro ao cadastrar veicluos"})
        return;
        }

        const newVeiculos = await prisma.veiculo.create({
            data: {
                chassi,
                modelo,
                cor,
                marca,
                estado,
                armazem,
                procedencia,
                userId
        }
    });

    console.log('Chassi cadastrado com sucesso', newVeiculos)
    res.status(201).json({message: 'Chassi cadastrado com sucesso', newVeiculos})

    } catch(error) {
        res.status(500).send("Erro ao criar chassi")
        console.error("Erro ao criar Chassi: ", error);
        next();
        console.log("teste")
    }

}
