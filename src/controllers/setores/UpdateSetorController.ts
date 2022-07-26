import { Request, Response } from "express";
import { PrismaSetoresRepository } from "../../repositories/prisma/setores/prisma-setores-repository";
import { UpdateSetorService } from "../../services/setores/UpdateSetorService";

class UpdateSetorController {
  async handle(req:Request, res:Response) {

    // Dados do parâmetro da requisição
    const { id } = req.params;

    // Dados do corpo da requisição
    const { nome } = req.body;

    // Repositório do modelo do Prisma
    const prismaSetoresRepository = new PrismaSetoresRepository();

    // Service
    const updateSetorService = new UpdateSetorService(prismaSetoresRepository);

    // Executando o service
    const setor = await updateSetorService.execute({
      id, 
      nome,
    })

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(setor instanceof Error) {
      return res.status(400).send(setor.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(201).send(
      {
        message:"Setor atualizado com sucesso!",
      }
    );
  }
}

export { UpdateSetorController };