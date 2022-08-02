import { Request, Response } from "express";
import { PrismaEquipamentosRepository } from "../../repositories/prisma/equipamentos/prisma-equipamentos-repository";
import { PrismaCondensadorasRepository } from "../../repositories/prisma/condensadoras/prisma-condensadoras-repository";
import { PrismaEvaporadorasRepository } from "../../repositories/prisma/evaporadoras/prisma-evaporadoras-repository";
import { CreateEquipamentoService } from "../../services/equipamentos/CreateEquipamentoService";

class CreateEquipamentoController {
  async handle(req:Request, res:Response) {

    // Dados do corpo da requisição
    const { tipo, linha, id_condensadora, id_evaporadora } = req.body;

    // Repositório do modelo do Prisma
    const prismaEquipamentosRepository = new PrismaEquipamentosRepository();
    const prismaCondensadorasRepository = new PrismaCondensadorasRepository();
    const prismaEvaporadorasRepository = new PrismaEvaporadorasRepository();

    // Service 
    const createEquipamentoService = new CreateEquipamentoService(prismaEquipamentosRepository, prismaCondensadorasRepository, prismaEvaporadorasRepository);

    // Executando o service
    const equipamento = await createEquipamentoService.execute({
      tipo, 
      linha, 
      id_condensadora, 
      id_evaporadora
    })

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(equipamento instanceof Error) {
      return res.status(400).send(equipamento.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(201).send(
      {
        message:"Equipamento criado com sucesso!",
      }
    );
  }
}

export { CreateEquipamentoController };