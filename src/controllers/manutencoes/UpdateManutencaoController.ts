import { Request, Response } from "express";
import { PrismaManutencoesRepository } from "../../repositories/prisma/manutencoes/prisma-manutencoes-repository";
import { FindManutencaoService } from "../../services/manutencoes/FindManutencaoService";
import { CreateDocumentoService } from "../../services/documentos/CreateDocumentoService";
import { PrismaDocumentosRepository } from "../../repositories/prisma/documentos/prisma-documentos-repository";
import { PrismaDocumentoManutencoesRepository } from "../../repositories/prisma/documentos/prisma-documentos_manutencoes-repository";
import { CreateDocumento_ManutencaoService } from "../../services/documentos/CreateDocumento_ManutencaoService";

class UpdateManutencaoController {
  async handle(req:Request, res:Response) {

    // Dados do parâmetro da requisição
    const { id } = req.params;

    // Repositório do modelo do Prisma
    const prismaManutencoesRepository = new PrismaManutencoesRepository();
    const prismaDocumentosRepository = new PrismaDocumentosRepository();
    const prismaDocumentosManutencoesRepository = new PrismaDocumentoManutencoesRepository();


    // Service 
    const findManutencaoService = new FindManutencaoService(prismaManutencoesRepository);

    // Executando o service
    const manutencao = await findManutencaoService.execute({
      id,
    })

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(manutencao instanceof Error) {
      return res.status(400).send(manutencao.message);
    }

    // Pegando os documentos
    if (req.files != null || req.files != undefined) {

      // Se o usuário enviar algum doucmento (PDF ou PNG)
      if (Object.keys(req.files).length > 0) {
        const createDocumentoService = new CreateDocumentoService(prismaDocumentosRepository);
        const createDocumentoManutencaoService = new CreateDocumento_ManutencaoService(prismaDocumentosManutencoesRepository);
        
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
          const id_manutencao = Object(manutencao).id;

          // Criando o documento da manutencao
          const doc_manutencaoCriado = await createDocumentoManutencaoService.execute({ id_doc, id_manutencao });

          if (doc_manutencaoCriado instanceof Error) {
            return res.status(400).json(doc_manutencaoCriado);
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
          const id_manutencao = Object(manutencao).id;

          // Criando o documento da manutencao
          const doc_manutencaoCriado = await createDocumentoManutencaoService.execute({ id_doc, id_manutencao });

          if (doc_manutencaoCriado instanceof Error) {
            return res.status(400).json(doc_manutencaoCriado);
          }
        }        
      }
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(201).send(
      {
        message:"Manutenção atualizada com sucesso!",
      }
    );
  }
}

export { UpdateManutencaoController };