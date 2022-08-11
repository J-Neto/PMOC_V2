import { Request, Response } from "express";
import { PrismaCondensadorasRepository } from "../../repositories/prisma/condensadoras/prisma-condensadoras-repository";
import { PrismaDocumentosRepository } from "../../repositories/prisma/documentos/prisma-documentos-repository";
import { PrismaDocumentoCondensadorasRepository } from "../../repositories/prisma/documentos/prisma-documentos_condensadoras-repository";
import { CreateCondensadoraService } from "../../services/condensadoras/CreateCondensadoraService";
import { CreateDocumentoService } from "../../services/documentos/CreateDocumentoService";
import { CreateDocumento_CondensadoraService } from "../../services/documentos/CreateDocumento_CondensadoraService";

class CreateCondensadoraController {
  async handle(req:Request, res:Response) {

    // Dados do corpo da requisição
    const { codigo, modelo, status, modulo, quadro, local_instalacao } = req.body;

    // Repositório do modelo do Prisma
    const prismaCondensadorasRepository = new PrismaCondensadorasRepository();
    const prismaDocumentosRepository = new PrismaDocumentosRepository();
    const prismaDocumentosCondensadorasRepository = new PrismaDocumentoCondensadorasRepository();

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

    // Criando os documentos
    if(req.files != null || req.files != undefined) {
      
      // Se o usuário enviar algum documento (PDF ou PNG)
      if(Object.keys(req.files).length > 0) {

        const createDocumentoService = new CreateDocumentoService(prismaDocumentosRepository);
        const createDocumentoCondensadoraService = new CreateDocumento_CondensadoraService(prismaDocumentosCondensadorasRepository);

        // Verificando se o documento inserido foi PNG
        if (Object.keys(req.files).includes("foto")) {
          
          const indice = Object.keys(req.files).indexOf("foto")

          const path = "http://192.168.6.20:3020/files/" + Object.values(req.files)[indice][0].filename;
          const filename = "http://192.168.6.20:3020/files/" + Object.values(req.files)[indice][0].filename;
          const originalName = Object.values(req.files)[indice][0].originalname;
          const fileFormat = Object.values(req.files)[indice][0].mimetype;
  
          const docCriado = await createDocumentoService.execute({ path, filename, originalName, fileFormat });
  
          // Retornando mensagem de erro caso aconteça algum errro na criação do doc
          if(docCriado instanceof Error) {
            return res.status(400).json(docCriado.message);
          }

          const id_doc = Object(docCriado).id;
          const id_condensadora = Object(condensadora).id;

          // Criando o documento da condensadora
          const doc_condensadoraCriado = await createDocumentoCondensadoraService.execute({ id_doc, id_condensadora });

          if (doc_condensadoraCriado instanceof Error) {
            return res.status(400).json(doc_condensadoraCriado);
          }
        }

        // Verificando se o documento inserido foi PDF
        if (Object.keys(req.files).includes("file")) {
  
          const indice = Object.keys(req.files).indexOf("file")

          const path = "http://192.168.6.20:3020/files/" + Object.values(req.files)[indice][0].filename;
          const filename = "http://192.168.6.20:3020/files/" + Object.values(req.files)[indice][0].filename;
          const originalName = Object.values(req.files)[indice][0].originalname;
          const fileFormat = Object.values(req.files)[indice][0].mimetype;
  
          const docCriado = await createDocumentoService.execute({ path, filename, originalName, fileFormat });
  
          // Retornando mensagem de erro caso aconteça algum errro na criação do doc
          if(docCriado instanceof Error) {
            return res.status(400).json(docCriado.message);
          }

          const id_doc = Object(docCriado).id;
          const id_condensadora = Object(condensadora).id;

          // Criando o documento da condensadora
          const doc_condensadoraCriado = await createDocumentoCondensadoraService.execute({ id_doc, id_condensadora });

          if (doc_condensadoraCriado instanceof Error) {
            return res.status(400).json(doc_condensadoraCriado);
          }
        }
      }

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