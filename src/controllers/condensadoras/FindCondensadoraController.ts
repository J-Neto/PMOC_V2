import { Request, Response } from "express";
import { PrismaCondensadorasRepository } from "../../repositories/prisma/condensadoras/prisma-condensadoras-repository";
import { PrismaDocumentosRepository } from "../../repositories/prisma/documentos/prisma-documentos-repository";
import { PrismaDocumentoCondensadorasRepository } from "../../repositories/prisma/documentos/prisma-documentos_condensadoras-repository";
import { FindCondensadoraService } from "../../services/condensadoras/FindCondensadoraService";
import { CreateDocumentoService } from "../../services/documentos/CreateDocumentoService";
import { CreateDocumento_CondensadoraService } from "../../services/documentos/CreateDocumento_CondensadoraService";

class FindCondensadoraController {
  async handle(req:Request, res:Response) {

    // Dados do parâmetro da requisição
    const { id } = req.params;

    const prismaCondensadorasRepository = new PrismaCondensadorasRepository();

    // Service 
    const findCondensadoraService = new FindCondensadoraService(prismaCondensadorasRepository);

    // Executando o service
    const condensadora = await findCondensadoraService.execute({
      id,
    })

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(condensadora instanceof Error) {
      return res.status(400).send(condensadora.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(201).send(
      {
        condensadora,
      }
    );
  }
}

export { FindCondensadoraController };