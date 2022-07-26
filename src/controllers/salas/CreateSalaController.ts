import { Request, Response } from "express";
import { PrismaSalasRepository } from "../../repositories/prisma/salas/prisma-salas-repository";
import { PrismaSetoresRepository } from "../../repositories/prisma/setores/prisma-setores-repository";
import { CreateSalaService } from "../../services/salas/CreateSalaService";

class CreateSalaController {
  async handle(req:Request, res:Response) {

    // Dados do corpo da requisição
    const { nome, andar, dimensao, id_setor } = req.body;

    // Repositório do modelo do Prisma
    const prismaSetoresRepository = new PrismaSetoresRepository();
    const prismaSalasRepository = new PrismaSalasRepository();

    // Service
    const createSalaService = new CreateSalaService(prismaSetoresRepository, prismaSalasRepository);

    // Executando o service
    const sala = await createSalaService.execute({
      nome,
      andar, 
      dimensao,
      id_setor
    })

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(sala instanceof Error) {
      return res.status(400).send(sala.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(201).send(
      {
        message:"Sala criada com sucesso!",
      }
    );
  }
}

export { CreateSalaController };