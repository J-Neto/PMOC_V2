import { Request, Response } from "express";
import { PrismaCondensadorasRepository } from "../../repositories/prisma/condensadoras/prisma-condensadoras-repository";
import { GetCondensadorasService } from "../../services/condensadoras/GetCondensadorasService";

class GetCondensadorasController {
  async handle(req:Request, res:Response) {

    const prismaCondensadorasRepository = new PrismaCondensadorasRepository();

    // Service 
    const getCondensadorasService = new GetCondensadorasService(prismaCondensadorasRepository);

    // Executando o service
    const condensadoras = await getCondensadorasService.execute()

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(condensadoras instanceof Error) {
      return res.status(400).send(condensadoras.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(201).send(
      {
        condensadoras,
      }
    );
  }
}

export { GetCondensadorasController };