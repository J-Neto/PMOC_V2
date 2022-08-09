import { prisma } from "../../../prisma";
import { DocumentoManutencaoCreateData, DocumentoManutencaoDelete, DocumentoManutencaoFind, DocumentoManutencoesRepository} from "../../interfaces/documentos/documentos_manutencoes-repository";

export class PrismaDocumentoManutencoesRepository implements DocumentoManutencoesRepository {
  
  async create({ id_doc, id_manutencao }: DocumentoManutencaoCreateData) {
    await prisma.documento_Manutencao.create({
      data: {
        id_doc,
        id_manutencao
      }
    });
  };

  async get() {
    const documentos = await prisma.documento_Manutencao.findMany({
    });
    return documentos;
  };

  async find({ id }: DocumentoManutencaoFind ) {
    const documento = await prisma.documento_Manutencao.findUnique(
      {
        where: {
          id,
        }
      }
    );
    return documento;
  };

  async delete({ id }: DocumentoManutencaoDelete){
    await prisma.documento_Manutencao.delete({
      where: {
        id,
      }
    });
  };
}