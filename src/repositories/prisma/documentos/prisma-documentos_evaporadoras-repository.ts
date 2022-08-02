import { prisma } from "../../../prisma";
import { DocumentoEvaporadoraCreateData, DocumentoEvaporadoraDelete, DocumentoEvaporadoraFind, DocumentoEvaporadorasRepository} from "../../interfaces/documentos/documentos_evaporadoras-repository";

export class PrismaDocumentoEvaporadorasRepository implements DocumentoEvaporadorasRepository {
  
  async create({ id_doc, id_evaporadora }: DocumentoEvaporadoraCreateData) {
    await prisma.documento_Evaporadora.create({
      data: {
        id_doc,
        id_evaporadora
      }
    });
  };

  async get() {
    const documentos = await prisma.documento_Evaporadora.findMany({
    });
    return documentos;
  };

  async find({ id }: DocumentoEvaporadoraFind ) {
    const documento = await prisma.documento_Evaporadora.findUnique(
      {
        where: {
          id,
        }
      }
    );
    return documento;
  };

  async delete({ id }: DocumentoEvaporadoraDelete){
    await prisma.documento_Evaporadora.delete({
      where: {
        id,
      }
    });
  };
}