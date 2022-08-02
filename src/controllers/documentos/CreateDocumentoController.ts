import { Request, Response } from "express";
import { PrismaDocumentosRepository } from "../../repositories/prisma/documentos/prisma-documentos-repository";
import { CreateDocumentoService } from "../../services/documentos/CreateDocumentoService";

class CreateDocumentoController {
  async handle(req:Request, res:Response) {

    // Repositório do modelo do Prisma
    const prismaDocumentosRepository = new PrismaDocumentosRepository();

    // Service 
    const createDocumentoService = new CreateDocumentoService(prismaDocumentosRepository);

    if(req.files != null || req.files != undefined) {
      
      // Verificando se o documento inserido foi PNG
      if (Object.keys(req.files).includes("foto")) {

        const indice = Object.keys(req.files).indexOf("foto")

        const path = "localhost:3001/files" + Object.values(req.files)[indice][0].filename;
        const filename = "localhost:3001/files" + Object.values(req.files)[indice][0].filename;
        const originalName = Object.values(req.files)[indice][0].originalname;
        const fileFormat = Object.values(req.files)[indice][0].mimetype;

        const docCriado = await createDocumentoService.execute({ path, filename, originalName, fileFormat });

        // Retornando mensagem de erro caso aconteça algum errro na criação do doc
        if(docCriado instanceof Error) {
          return res.status(400).json(docCriado.message);
        }

        return res.status(201).json(docCriado);
      }

      // Verificando se o documento inserido foi PDF
      if (Object.keys(req.files).includes("file")) {

        const indice = Object.keys(req.files).indexOf("file")

        const path = "localhost:3001/files" + Object.values(req.files)[indice][0].filename;
        const filename = "localhost:3001/files" + Object.values(req.files)[indice][0].filename;
        const originalName = Object.values(req.files)[indice][0].originalname;
        const fileFormat = Object.values(req.files)[indice][0].mimetype;

        const docCriado = await createDocumentoService.execute({ path, filename, originalName, fileFormat });

        // Retornando mensagem de erro caso aconteça algum errro na criação do doc
        if(docCriado instanceof Error) {
          return res.status(400).json(docCriado.message);
        }

        return res.status(201).json(docCriado);
      }

    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(201).send(
      {
        message:"Documento criado com sucesso!",
      }
    );
  }
}

export { CreateDocumentoController };