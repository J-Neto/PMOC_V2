import { Request, Response } from "express";
import { PrismaSetoresRepository } from "../../repositories/prisma/setores/prisma-setores-repository";
import { DeleteSetorService } from "../../services/setores/DeleteSetorService";

class DeleteSetorController {
  async handle(req:Request, res:Response) {

    // Dados do parâmetro da requisição
    const { id } = req.params;

    // Repositório do modelo do Prisma
    const prismaSetoresRepository = new PrismaSetoresRepository();

    // Service
    const deleteSetorService = new DeleteSetorService(prismaSetoresRepository);

    // Executando o service
    const setor = await deleteSetorService.execute({
      id, 
    })

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(setor instanceof Error) {
      return res.status(400).send(setor.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(204).end();
  }
}

export { DeleteSetorController };