import { prisma } from "../../../prisma";
import { RelatorioCreateData, RelatorioDelete, RelatorioFind, RelatoriosRepository, RelatorioUpdate} from "../../interfaces/relatorios/relatorios-repository";

export class PrismaRelatoriosRepository implements RelatoriosRepository {
  
  async create({ id_entidade, acao, comentario }: RelatorioCreateData) {
    await prisma.relatorio.create({
      data: {
        id_entidade,
        acao,
        comentario
      }
    });
  };

  async get() {
    const itens = await prisma.relatorio.findMany();
    return itens;
  };

  async find({ id }: RelatorioFind ) {
    const relatorio = await prisma.relatorio.findUnique(
      {
        where: {
          id,
        }
      }
    );
    return relatorio;
  };

  async delete({ id }: RelatorioDelete){
    await prisma.relatorio.delete({
      where: {
        id,
      }
    });
  };

  async update({ id, id_entidade, acao, comentario }: RelatorioUpdate){
    await prisma.relatorio.update({
      where: {
        id,
      },
      data: {
        id_entidade, 
        acao, 
        comentario
      }
    })
  };

}