import { Request, Response } from "express";
import { PrismaSetoresRepository } from "../../repositories/prisma/setores/prisma-setores-repository";
import { CreateSetorService } from "../../services/setores/CreateSetorService";

class CreateSetorController {
  async handle(req:Request, res:Response) {

    // Dados do corpo da requisição
    const { nome } = req.body;

    // Repositório do modelo do Prisma
    const prismaSetoresRepository = new PrismaSetoresRepository();

    // Service 
    const createSetorService = new CreateSetorService(prismaSetoresRepository);

    // Executando o service
    const setor = await createSetorService.execute({
      nome,
    })

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(setor instanceof Error) {
      return res.status(400).send(setor.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(201).send(
      {
        message:"Setor criado com sucesso!",
      }
    );
  }
}

export { CreateSetorController };