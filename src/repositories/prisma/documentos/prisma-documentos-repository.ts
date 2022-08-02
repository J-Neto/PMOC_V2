import { prisma } from "../../../prisma";
import { DocumentoCreateData, DocumentoDelete, DocumentoFind, DocumentosRepository} from "../../interfaces/documentos/documentos-repository";

export class PrismaDocumentosRepository implements DocumentosRepository {
  
  async create({ path, filename, originalName, fileFormat }: DocumentoCreateData) {
    return await prisma.documento.create({
      data: {
        path,
        filename,
        originalName,
        fileFormat
      }
    });
  };

  async get() {
    const documentos = await prisma.documento.findMany({
      orderBy: {
        filename: "asc"
      }
    });
    return documentos;
  };

  async find({ id }: DocumentoFind ) {
    const documento = await prisma.documento.findUnique(
      {
        where: {
          id,
        }
      }
    );
    return documento;
  };

  async delete({ id }: DocumentoDelete){
    await prisma.documento.delete({
      where: {
        id,
      }
    });
  };
}