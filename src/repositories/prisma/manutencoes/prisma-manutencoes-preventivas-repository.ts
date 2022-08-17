import { prisma } from "../../../prisma";
import { ManutencaoPreventivaCreateData, ManutencaoPreventivaDelete, ManutencaoPreventivaFind, ManutencoesPreventivasRepository, ManutencaoPreventivaUpdate, ManutencaoPreventivaFindByManutencao} from "../../interfaces/manutencoes/manutencoes-preventivas-repository";

export class PrismaManutencoesPreventivasRepository implements ManutencoesPreventivasRepository {
  
  async create({ previsao_termino, data_termino, data_agendado, id_manutencao, id_item, id_tarefa }: ManutencaoPreventivaCreateData) {
    return await prisma.manutencao_Preventiva.create({
      data: {
        previsao_termino,
        data_termino,
        data_agendado,
        id_manutencao,
        id_item,
        id_tarefa
      }
    });
  };

  async get() {
    const itens = await prisma.manutencao_Preventiva.findMany();
    return itens;
  };

  async find({ id }: ManutencaoPreventivaFind ) {
    const manutencao = await prisma.manutencao_Preventiva.findUnique(
      {
        where: {
          id,
        }
      }
    );
    return manutencao;
  };

  async findByManutencao({ id_manu }: ManutencaoPreventivaFindByManutencao) {
    return await prisma.manutencao_Preventiva.findMany({
      where: {
        id_manutencao: id_manu
      },
      include: {
        tarefa: {
          select: {
            frequencia: true
          }
        }
      }
    })
  }

  async delete({ id }: ManutencaoPreventivaDelete){
    await prisma.manutencao_Preventiva.delete({
      where: {
        id,
      }
    });
  };

  async update({ id, previsao_termino, data_termino, data_agendado, id_manutencao, id_item, id_tarefa }: ManutencaoPreventivaUpdate){
    
    // Atualizando a manutencao
    return await prisma.manutencao_Preventiva.update({
      where: {
        id,
      },
      data: {
        previsao_termino,
        data_termino,
        data_agendado,
        id_manutencao,
        id_item,
        id_tarefa
      },
      include: {
        tarefa: {
          select: {
            frequencia: true
          }
        }
      }
    });
  };

}