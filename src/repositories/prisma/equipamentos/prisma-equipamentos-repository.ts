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
                select: {
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
                select: {
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

    // Dados da condensadora
    let cond = equipamento?.condensadora;

    // Salvando os dados dos documentos da condensadora
    const doc_conds_antigo = Object(equipamento)?.condensadora.Documento_Condensadora;

    // Removendo o campo de documentos antigo
    delete Object(equipamento)?.condensadora.Documento_Condensadora;

    // Array com os novos documentos
    let docs = []

    // Variável auxiliar
    let doc_obj;

    for (let doc of doc_conds_antigo) {
      doc_obj = {
        nome: Object(Object.values(doc)[0]).originalName,
        path: Object(Object.values(doc)[0]).path,
      }

      docs.push(doc_obj)
    }

    // Colocando o campo novo dos documentos na condensadora
    Object(cond).docs = docs

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
      condensadora: cond
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