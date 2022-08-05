import { prisma } from "../../../prisma";
import { ManutencaoCorretivaCreateData, ManutencaoCorretivaDelete, ManutencaoCorretivaFind, ManutencoesCorretivasRepository, ManutencaoCorretivaUpdate} from "../../interfaces/manutencoes/manutencoes-corretivas-repository";

export class PrismaManutencoesCorretivasRepository implements ManutencoesCorretivasRepository {
  
  async create({ descricao, previsao_termino, data_termino, id_manutencao, id_item }: ManutencaoCorretivaCreateData) {
    return await prisma.manutencao_Corretiva.create({
      data: {
        descricao,
        previsao_termino,
        data_termino,
        id_manutencao,
        id_item
      }
    });
  };

  async get() {
    const itens = await prisma.manutencao_Corretiva.findMany();
    return itens;
  };

  async find({ id }: ManutencaoCorretivaFind ) {
    const manutencao = await prisma.manutencao_Corretiva.findUnique(
      {
        where: {
          id,
        }
      }
    );
    return manutencao;
  };

  async delete({ id }: ManutencaoCorretivaDelete){
    await prisma.manutencao_Corretiva.delete({
      where: {
        id,
      }
    });
  };

  async update({ id, descricao, previsao_termino, data_termino, id_manutencao, id_item }: ManutencaoCorretivaUpdate){
    
    // Atualizando a manutencao
    await prisma.manutencao_Corretiva.update({
      where: {
        id,
      },
      data: {
        descricao,
        previsao_termino,
        data_termino,
        id_manutencao,
        id_item
      }
    });
  };

}