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
    const { idUser } = req.params;
    const { page = 1, pageSize = 10 } = req.query;

    try {
        if (!idUser) {
            res.status(400).json({ message: "Id do usuário obrigatório" });
            return;
        }

        const pageNumber = parseInt(page as string, 10);
        const pageSizeNumber = parseInt(pageSize as string, 10);

        if (isNaN(pageNumber) || isNaN(pageSizeNumber) || pageNumber < 1 || pageSizeNumber < 1) {
            res.status(400).json({ message: "Parâmetros de paginação inválidos" });
            return;
        }

        const totalVeiculos = await prisma.veiculo.count({
            where: { userId: idUser }
        });

        const items = await prisma.veiculo.findMany({
            where: { userId: idUser },
            select: {
                chassiInt: true,
                chassi: true,
                modelo: true,
                marca: true,
                cor: true,
                estado: true,
                armazem: true,
                procedencia: true,
            },
            skip: (pageNumber - 1) * pageSizeNumber,
            take: pageSizeNumber,
        });

        res.json({
            items,
        });
        console.log(items)
    } catch (error) {
        console.error("Erro ao buscar veículos:", error);
        res.status(500).json({ message: "Erro ao buscar veículos" });
        next();
    }
};