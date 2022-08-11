import { prisma } from "../../../prisma";
import { ManutencaoCreateData, ManutencaoDelete, ManutencaoFind, ManutencoesRepository, ManutencaoUpdate, ManutencaoFindByCondensadora, ManutencaoFindByEvaporadora, ManutencaoStart, ManutencaoPause, ManutencaoFinish} from "../../interfaces/manutencoes/manutencoes-repository";

export class PrismaManutencoesRepository implements ManutencoesRepository {
  
  async create({ tipo, status, comentario, tec_responsavel, custo, agendado, foto ,previsao_termino, data_termino, data_agendado, id_condensadora, id_evaporadora }: ManutencaoCreateData) {
    
    // Criando a manutenção
    const manutencao = await prisma.manutencao.create({
      data: {
        tipo, 
        status, 
        comentario, 
        tec_responsavel, 
        custo, 
        agendado, 
        foto,
        previsao_termino, 
        data_termino, 
        data_agendado, 
        id_condensadora, 
        id_evaporadora
      }
    });

    // Adicionando registro de criação aos relatórios
    await prisma.relatorio.create({
      data: {
        id_entidade: manutencao.id,
        acao: manutencao.status,
      }
    })

    return manutencao;
  };

  async get() {

    // Buscando as manutencoes
    const manutencoes = await prisma.manutencao.findMany({
      orderBy: {
        status: "asc"
      },
      include: {
        Documento_Manutencao: true,
        condensadora: true,
        evaporadora: {
          select: {
            id: true,
            codigo: true,
            modelo: true,
            marca: true,
            potencia: true,
            status: true,
            status_anterior: true,
            quadro: true,
            id_sala: true,
            created_at: true,
            updated_at: true,
            sala: {
              select: {
                nome: true,
                setor: {
                  select: {
                    nome: true
                  }
                }
              }
            }
          },
        },
        Manutencao_Corretiva: {
          select: {
            item: {
              select: {
                nome: true,
              }
            },
            descricao: true
          }
        },
        Manutencao_Preventiva: {
          orderBy: {
            tarefa: {
              descricao: "asc"
            }
          },
          select: {
            item: {
              select: {
                nome: true,
              }
            },
            tarefa: {
              select: {
                descricao: true,
              }
            }
          }
        }
      },
    });
    return manutencoes;
  };

  async find({ id }: ManutencaoFind ) {
    const manutencao = await prisma.manutencao.findUnique(
      {
        where: {
          id,
        }
      }
    );
    return manutencao;
  };

  async findByCondensadora({ id_condensadora }: ManutencaoFindByCondensadora) {
    return await prisma.manutencao.findMany({
      where: {
        id_condensadora
      }
    })
  }

  async findByEvaporadora({ id_evaporadora }: ManutencaoFindByEvaporadora) {
    return await prisma.manutencao.findMany({
      where: {
        id_evaporadora
      }
    })
  }

  async delete({ id }: ManutencaoDelete){
    await prisma.manutencao.delete({
      where: {
        id,
      }
    });
    // Adicionando registro de criação aos relatórios
    await prisma.relatorio.create({
      data: {
        id_entidade: id,
        acao: "excluido",
      }
    })

  };

  async update({ id, tipo, status, comentario, tec_responsavel, custo, agendado, foto ,previsao_termino, data_termino, data_agendado, id_condensadora, id_evaporadora }: ManutencaoUpdate){
    
    // Atualizando a manutencao
    return await prisma.manutencao.update({
      where: {
        id,
      },
      data: {
        tipo, 
        status, 
        comentario, 
        tec_responsavel, 
        custo, 
        agendado, 
        foto,
        previsao_termino, 
        data_termino, 
        data_agendado, 
        id_condensadora, 
        id_evaporadora
      }
    });
  };

  async start({ id, status,agendado }: ManutencaoStart) {
    const manutencao = await prisma.manutencao.update({
      where: {
        id
      },
      data: {
        status,
        agendado
      }
    });

    // Adicionando registro de criação aos relatórios
    await prisma.relatorio.create({
      data: {
        id_entidade: manutencao.id,
        acao: manutencao.status,
      }
    })
  };

  async pause({ id, status, comentario}: ManutencaoPause) {
    const manutencao = await prisma.manutencao.update({
      where: {
        id
      },
      data: {
        status,
        comentario
      }
    });

    // Adicionando registro de criação aos relatórios
    await prisma.relatorio.create({
      data: {
        id_entidade: manutencao.id,
        acao: manutencao.status,
        comentario
      }
    })
  }

  async finish({ id, status }: ManutencaoFinish) {
    const manutencao = await prisma.manutencao.update({
      where: {
        id
      },
      data: {
        status,
        data_termino: new Date()
      }
    });

    // Adicionando registro de criação aos relatórios
    await prisma.relatorio.create({
      data: {
        id_entidade: manutencao.id,
        acao: manutencao.status,
      }
    });
  }

}