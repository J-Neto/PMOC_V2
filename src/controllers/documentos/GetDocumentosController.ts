import { Request, Response } from "express";
import { PrismaDocumentosRepository } from "../../repositories/prisma/documentos/prisma-documentos-repository";
import { GetDocumentosService } from "../../services/documentos/GetDocumentosService";

class GetDocumentosController {
  async handle(req:Request, res:Response) {

    // Repositório do modelo do Prisma
    const prismaDocumentosRepository = new PrismaDocumentosRepository();

    // Service 
    const createDocumentoService = new GetDocumentosService(prismaDocumentosRepository);

    // Executando o service
    const documentos = await createDocumentoService.execute()

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(documentos instanceof Error) {
      return res.status(400).send(documentos.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(201).send(
      {
        documentos
      }
    );
  }
}

export { GetDocumentosController };