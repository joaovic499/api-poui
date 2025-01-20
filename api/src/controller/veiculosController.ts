import { PrismaClient, Veiculo } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

export const criarVeiculo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const {chassi, modelo, cor, estado, armazem, procedencia, userId, marca} = req.body

    try {
        if (!chassi || !modelo || !cor || !estado || !armazem || !procedencia || !marca || !userId ) {
        res.status(400).json({message: "Erro ao cadastrar veicluos"})
        return;
        }

        const newVeiculos = await prisma.veiculo.create({
            data: {
                userId,
                chassi,
                modelo,
                cor,
                marca,
                estado,
                armazem,
                procedencia,
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

export const getVeiculos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {idUser} = req.params;

    try {
        if (!idUser) {
            res.status(400).json({message: "Id do usuário obrigatório"});
            return
        }

        const veiculos = await prisma.veiculo.findMany({
            where: {
                userId: idUser
            },
            select: {
                chassi: true,
                modelo: true,
                marca: true,
                estado: true,
                armazem: true,
                procedencia: true,
            }
        });

        res.json(veiculos)
    } catch (error) {
        console.log("Erro ao buscar veiculos", error)
        res.status(500).send("Erro ao buscar veiculos")
        next();
    }
}
