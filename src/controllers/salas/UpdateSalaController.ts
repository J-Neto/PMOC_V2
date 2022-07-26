import { Request, Response } from "express";
import { PrismaSalasRepository } from "../../repositories/prisma/salas/prisma-salas-repository";
import { PrismaSetoresRepository } from "../../repositories/prisma/setores/prisma-setores-repository";
import { UpdateSalaService } from "../../services/salas/UpdateSalaService";

class UpdateSalaController {
  async handle(req:Request, res:Response) {

    // Dados do parâmetro da requição
    const { id } = req.params;

    // Dados do corpo da requisição
    const { nome, andar, dimensao, id_setor } = req.body;

    // Repositório do modelo do Prisma
    const prismaSetoresRepository = new PrismaSetoresRepository();
    const prismaSalasRepository = new PrismaSalasRepository();

    // Service
    const updateSalaService = new UpdateSalaService(prismaSetoresRepository, prismaSalasRepository);

    // Executando o service
    const sala = await updateSalaService.execute({
      id,
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
        message:"Sala atualizada com sucesso!",
      }
    );
  }
}

export { UpdateSalaController };