import { Request, Response } from "express";
import { PrismaEquipamentosRepository } from "../../repositories/prisma/equipamentos/prisma-equipamentos-repository";
import { FindEquipamentoService } from "../../services/equipamentos/FindEquipamentoService";

class FindEquipamentoController {
  async handle(req:Request, res:Response) {

    // Dados do parâmetro da requisição
    const { id } = req.params;

    // Repositório do modelo do Prisma
    const prismaEquipamentosRepository = new PrismaEquipamentosRepository();

    // Service 
    const findEquipamentoService = new FindEquipamentoService(prismaEquipamentosRepository);

    // Executando o service
    const equipamento = await findEquipamentoService.execute({
      id,
    })

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(equipamento instanceof Error) {
      return res.status(400).send(equipamento.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(201).send(
      {
        data: [equipamento],
      }
    );
  }
}

export { FindEquipamentoController };