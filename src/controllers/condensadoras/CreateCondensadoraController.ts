import { Request, Response } from "express";
import { PrismaCondensadorasRepository } from "../../repositories/prisma/condensadoras/prisma-condensadoras-repository";
import { CreateCondensadoraService } from "../../services/condensadoras/CreateCondensadoraService";

class CreateCondensadoraController {
  async handle(req:Request, res:Response) {

    // Dados do corpo da requisição
    const { codigo, modelo, status, modulo, quadro, local_instalacao } = req.body;

    // Repositório do modelo do Prisma
    const prismaCondensadorasRepository = new PrismaCondensadorasRepository();

    // Service 
    const createCondensadoraService = new CreateCondensadoraService(prismaCondensadorasRepository);

    // Executando o service
    const condensadora = await createCondensadoraService.execute({
      codigo, 
      modelo, 
      status, 
      modulo, 
      quadro, 
      local_instalacao
    })

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(condensadora instanceof Error) {
      return res.status(400).send(condensadora.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(201).send(
      {
        message:"Condensadora criada com sucesso!",
      }
    );
  }
}

export { CreateCondensadoraController };