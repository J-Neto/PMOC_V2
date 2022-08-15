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

    for (let manu of Object(manutencoes)) {

      // Nova key com o nome da sala
      manu.evaporadora.nome_sala = manu.evaporadora.sala.nome
      
      // Nova key com o nome do setor
      manu.evaporadora.nome_setor = manu.evaporadora.sala.setor.nome

      // Deletando a key antiga da sala
      delete manu.evaporadora.sala

      // Se for do tipo corretiva
      if (manu.tipo == "corretiva") {

        // ... então apagamos o campo "Manutencao_Preventiva"
        delete Object(manu)?.Manutencao_Preventiva;

        // Criando uma nova key de nome "corretiva" e atribuímos a ela os dados da corretiva
        Object(manu).corretiva = Object(manu).Manutencao_Corretiva

        // Apagamos a key antiga
        delete Object(manu).Manutencao_Corretiva

        // Agora organizamos os dados da corretiva
        for (let corr of Object(manu).corretiva) {

          // Variável auxiliar para guardar o nome do item
          const nova_key = corr.item.nome

          // Apagando key antiga do nome do itme
          delete corr.item.nome

          // Criando nova key "item"
          corr.item = nova_key
        }
      }

      // Se for do tipo preventiva
      if (manu.tipo == "preventiva") {
        // ... então apagamos o campo "Manutencao_Corretiva"
        delete Object(manu)?.Manutencao_Corretiva;

        // Criando uma nova key de nome "preventiva" e atribuímos a ela os dados da preventiva
        Object(manu).preventiva = Object(manu).Manutencao_Preventiva

        // Apagamos a key antiga
        delete Object(manu).Manutencao_Preventiva

        // Agora organizamos os dados da preventiva
        for (let prev of Object(manu).preventiva) {
          
          // Variável auxiliar para guardar o nome do item
          const nova_key = prev.item.nome
          
          // Apagando key antiga do nome do itme
          delete prev.item.nome

          // Criando nova key "item"
          prev.item = nova_key

          // Variável auxiliar para guardar o nome da descrição da tarefa
          const nova_descricao = prev.tarefa.descricao

          // Apagando key antiga da tarefa
          delete prev.tarefa

          // Criando nova key "descricao"
          prev.descricao = nova_descricao
        }
        

      }


    }


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