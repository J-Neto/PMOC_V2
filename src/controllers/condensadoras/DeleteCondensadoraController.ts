import { Request, Response } from "express";
import { PrismaCondensadorasRepository } from "../../repositories/prisma/condensadoras/prisma-condensadoras-repository";
import { DeleteCondensadoraService } from "../../services/condensadoras/DeleteCondensadoraService";

class DeleteCondensadoraController {
  async handle(req:Request, res:Response) {

    // Dados do parâmetro da requisição
    const { id } = req.params;

    const prismaCondensadorasRepository = new PrismaCondensadorasRepository();

    // Service 
    const deleteCondensadoraService = new DeleteCondensadoraService(prismaCondensadorasRepository);

    // Executando o service
    const condensadora = await deleteCondensadoraService.execute({
      id,
    })

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(condensadora instanceof Error) {
      return res.status(400).send(condensadora.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(204).end();
  }
}

export { DeleteCondensadoraController };