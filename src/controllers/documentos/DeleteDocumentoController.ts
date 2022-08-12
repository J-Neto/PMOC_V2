import { Request, Response } from "express";
import { PrismaDocumentosRepository } from "../../repositories/prisma/documentos/prisma-documentos-repository";
import { DeleteDocumentoService } from "../../services/documentos/DeleteDocumentoService";

class DeleteDocumentoController {
  async handle(req:Request, res:Response) {

    // Dados do parâmetro da requisição
    const {id} = req.params;

    // Repositório do modelo do Prisma
    const prismaDocumentosRepository = new PrismaDocumentosRepository();

    // Service 
    const deleteDocumentoService = new DeleteDocumentoService(prismaDocumentosRepository);

    // Executando o service
    const documento = await deleteDocumentoService.execute({ id })

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(documento instanceof Error) {
      return res.status(400).send(documento.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(204).end();
  }
}

export { DeleteDocumentoController };