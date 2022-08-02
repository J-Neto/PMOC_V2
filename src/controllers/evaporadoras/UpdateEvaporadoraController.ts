import { Request, Response } from "express";
import { PrismaDocumentosRepository } from "../../repositories/prisma/documentos/prisma-documentos-repository";
import { PrismaDocumentoEvaporadorasRepository } from "../../repositories/prisma/documentos/prisma-documentos_evaporadoras-repository";
import { PrismaEvaporadorasRepository } from "../../repositories/prisma/evaporadoras/prisma-evaporadoras-repository";
import { CreateDocumentoService } from "../../services/documentos/CreateDocumentoService";
import { CreateDocumento_EvaporadoraService } from "../../services/documentos/CreateDocumento_EvaporadoraService";
import { UpdateEvaporadoraService } from "../../services/evaporadoras/UpdateEvaporadoraService";

class UpdateEvaporadoraController {
  async handle(req:Request, res:Response) {

    // Dados do parâmetro da requisição
    const { id } = req.params;

    // Dados do corpo da requisição
    const { codigo, modelo, marca, potencia, status, quadro } = req.body;

    // Repositório do modelo do Prisma
    const prismaEvaporadorasRepository = new PrismaEvaporadorasRepository();
    const prismaDocumentosRepository = new PrismaDocumentosRepository();
    const prismaDocumentosEvaporadorasRepository = new PrismaDocumentoEvaporadorasRepository();

    // Service 
    const updateEvaporadoraService = new UpdateEvaporadoraService(prismaEvaporadorasRepository);

    // Executando o service
    const evaporadora = await updateEvaporadoraService.execute({
      id,
      codigo, 
      modelo, 
      marca,
      potencia,
      status, 
      quadro, 
    })

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(evaporadora instanceof Error) {
      return res.status(400).send(evaporadora.message);
    }

    // Criando os documentos
    if(req.files != null || req.files != undefined) {
      
      // Se o usuário enviar algum documento (PDF ou PNG)
      if(Object.keys(req.files).length > 0) {

        const createDocumentoService = new CreateDocumentoService(prismaDocumentosRepository);
        const createDocumentoEvaporadoraService = new CreateDocumento_EvaporadoraService(prismaDocumentosEvaporadorasRepository);

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

          const id_doc = Object(docCriado).id;
          const id_evaporadora = Object(evaporadora).id;

          // Criando o documento da evaporadora
          const doc_evaporadoraCriado = await createDocumentoEvaporadoraService.execute({ id_doc, id_evaporadora });

          if (doc_evaporadoraCriado instanceof Error) {
            return res.status(400).json(doc_evaporadoraCriado);
          }
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

          const id_doc = Object(docCriado).id;
          const id_evaporadora = Object(evaporadora).id;

          // Criando o documento da evaporadora
          const doc_evaporadoraCriado = await createDocumentoEvaporadoraService.execute({ id_doc, id_evaporadora });

          if (doc_evaporadoraCriado instanceof Error) {
            return res.status(400).json(doc_evaporadoraCriado);
          }
        }
      }

    }
    

    // Retornando mensagem de sucesso para o usuário
    return res.status(201).send(
      {
        message:"Evaporadora atualizada com sucesso!",
      }
    );
  }
}

export { UpdateEvaporadoraController };