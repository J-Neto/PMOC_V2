import { prisma } from "../../../prisma";
import { DocumentoCondensadoraCreateData, DocumentoCondensadoraDelete, DocumentoCondensadoraFind, DocumentoCondensadorasRepository} from "../../interfaces/documentos/documentos_condensadoras-repository";

export class PrismaDocumentoCondensadorasRepository implements DocumentoCondensadorasRepository {
  
  async create({ id_doc, id_condensadora }: DocumentoCondensadoraCreateData) {
    await prisma.documento_Condensadora.create({
      data: {
        id_doc,
        id_condensadora
      }
    });
  };

  async get() {
    const documentos = await prisma.documento_Condensadora.findMany({
    });
    return documentos;
  };

  async find({ id }: DocumentoCondensadoraFind ) {
    const documento = await prisma.documento_Condensadora.findUnique(
      {
        where: {
          id,
        }
      }
    );
    return documento;
  };

  async delete({ id }: DocumentoCondensadoraDelete){
    await prisma.documento_Condensadora.delete({
      where: {
        id,
      }
    });
  };
}