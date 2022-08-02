import { Request, Response } from "express";
import { PrismaEvaporadorasRepository } from "../../repositories/prisma/evaporadoras/prisma-evaporadoras-repository";
import { GetEvaporadorasService } from "../../services/evaporadoras/GetEvaporadorasService";

class GetEvaporadorasController {
  async handle(req:Request, res:Response) {

    // Repositório do modelo do Prisma
    const prismaEvaporadorasRepository = new PrismaEvaporadorasRepository();

    // Service 
    const getEvaporadorasService = new GetEvaporadorasService(prismaEvaporadorasRepository);

    // Executando o service
    const evaporadoras = await getEvaporadorasService.execute();

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(evaporadoras instanceof Error) {
      return res.status(400).send(evaporadoras.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(201).send(
      {
        evaporadoras,
      }
    );
  }
}

export { GetEvaporadorasController };