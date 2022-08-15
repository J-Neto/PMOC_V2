import { notEqual } from "assert";
import { prisma } from "../../../prisma";
import { EquipamentoCreateData, EquipamentoDelete, EquipamentoFind, EquipamentoFindByCondensadora, EquipamentoFindByEvaporadora, EquipamentoFind_SPLIT_ByCondensadora, EquipamentosRepository, EquipamentoUpdate} from "../../interfaces/equipamentos/equipamentos-repository";

export class PrismaEquipamentosRepository implements EquipamentosRepository {
    
  async create({ tipo, linha, codigo, status, id_condensadora, id_evaporadora }: EquipamentoCreateData) {

    return await prisma.equipamento.create({
      data: {
        tipo,
        linha,
        codigo, 
        status,
        id_condensadora,
        id_evaporadora
      }
    });
  };

  async get() {
    const itens = await prisma.equipamento.findMany({
      orderBy: {
        codigo: "asc"
      }
    });
    return itens;
  };

  async find({ id }: EquipamentoFind ) {
    const equipamento = await prisma.equipamento.findUnique(
      {
        where: {
          id,
        },
        include: {
          condensadora: {
            include: {
              Documento_Condensadora: {
                select: {
                  documento: {
                    select: {
                      originalName: true,
                      path: true
                    }
                  }
                }
              },
              Manutencao: {
                include: {
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
                }
              }
            }
          },
          evaporadora: {
            include: {
              sala: {
                select: {
                  nome: true
                }
              },
              Documento_Evaporadora: {
                select: {
                  documento: {
                    select: {
                      originalName: true,
                      path: true
                    }
                  }
                }
              },
              Manutencao: {
                include: {
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
                }
              }
            }
          }
        }
      }
    );

    // // DOCUMENTOS ---------------------------------------------------------------------------------------
    // // Salvando os dados dos documentos da condensadora
    // Percorrendo o array dos documentos
    for (let doc of Object(equipamento)?.condensadora.Documento_Condensadora) {
      
      // Salvando o nome do documento em nova key
      doc.nome = doc.documento.originalName

      // Salvando o path do documento em nova key
      doc.path = doc.documento.path

      // Deletando key antiga
      delete doc.documento
    }

    // Criando uma nova key "docs" com os dados dos documentos
    Object(equipamento).condensadora.docs = Object(equipamento)?.condensadora.Documento_Condensadora;
    
    // Deletando a key antiga das documentos
    delete Object(equipamento)?.condensadora.Documento_Condensadora;

    // // Salvando os dados dos documentos da evaporadora
    // Percorrendo o array dos documentos
    for (let doc of Object(equipamento)?.evaporadora.Documento_Evaporadora) {
      
      // Salvando o nome do documento em nova key
      doc.nome = doc.documento.originalName

      // Salvando o path do documento em nova key
      doc.path = doc.documento.path

      // Deletando key antiga
      delete doc.documento
    }

    // Criando uma nova key "docs" com os dados dos documentos
    Object(equipamento).evaporadora.docs = Object(equipamento)?.evaporadora.Documento_Evaporadora;
    
    // Deletando a key antiga das documentos
    delete Object(equipamento)?.evaporadora.Documento_Evaporadora;
    
    // // MANUTENÇÕES ---------------------------------------------------------------------------------------
    // // CONDENSADORAS

    // Percorrendo o array com as manutenções
     for (let manu of Object(equipamento)?.condensadora.Manutencao) {
      
      // Se a manutenção for do tipo "corretiva" ...
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

      // Se a manutenção for do tipo "preventiva" ..
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

    // Criando uma nova key "manutencoes" com os dados das manutenções
    Object(equipamento).condensadora.manutencoes = Object(equipamento)?.condensadora.Manutencao
    
    // Deletando a key antiga das manutenções
    delete Object(equipamento)?.condensadora.Manutencao

    // // EVAPORADORAS
    // Percorrendo o array com as manutenções
    for (let manu of Object(equipamento)?.evaporadora.Manutencao) {
      
      // Se a manutenção for do tipo "corretiva" ...
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

      // Se a manutenção for do tipo "preventiva" ..
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

    // Criando uma nova key "manutencoes" com os dados das manutenções
    Object(equipamento).evaporadora.manutencoes = Object(equipamento)?.evaporadora.Manutencao
    
    // Deletando a key antiga das manutenções
    delete Object(equipamento)?.evaporadora.Manutencao

    // Corrigindo a key do nome da sala da evaporadora
    Object(equipamento).evaporadora.nome_sala = equipamento?.evaporadora.sala?.nome;
    delete Object(equipamento).evaporadora.sala;

    const equipamento_final = {
      id: equipamento?.id,
      tipo: equipamento?.tipo,
      linha: equipamento?.linha,
      codigo: equipamento?.codigo,
      status: equipamento?.status,
      id_condensadora: equipamento?.id_condensadora,
      id_evaporadora: equipamento?.id_evaporadora,
      created_at: equipamento?.created_at,
      updated_at: equipamento?.updated_at,
      condensadora: equipamento?.condensadora,
      evaporadora: equipamento?.evaporadora
    }

    return equipamento_final;
  };

  async findByCondensadora({ id_condensadora }: EquipamentoFindByCondensadora) {
    return await prisma.equipamento.findMany(
      {
        where: {
          id_condensadora,
        },
      }
    )
  }

  async findSPLITByCondensadora({ id_condensadora }: EquipamentoFind_SPLIT_ByCondensadora) {
    return await prisma.equipamento.findFirst({
      where: {
        id_condensadora,
        tipo: "SPLIT"
      }
    })
  }

  async findByEvaporadora({ id_evaporadora }: EquipamentoFindByEvaporadora) {
    return await prisma.equipamento.findMany(
      {
        where: {
          id_evaporadora
        }
      }
    )
  }

  async delete({ id }: EquipamentoDelete){
    await prisma.equipamento.delete({
      where: {
        id,
      }
    });
  };

  async update({ id, tipo, linha, codigo, status, id_condensadora, id_evaporadora }: EquipamentoUpdate){
    await prisma.equipamento.update({
      where: {
        id,
      },
      data: {
        tipo,
        linha,
        codigo, 
        status,
        id_condensadora,
        id_evaporadora
      }
    })
  };

}