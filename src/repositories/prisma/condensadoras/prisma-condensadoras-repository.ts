import { prisma } from "../../../prisma";
import { CondensadoraCreateData, CondensadoraDelete, CondensadoraFind, CondensadoraFindByCodigo, CondensadorasRepository, CondensadoraUpdate} from "../../interfaces/condensadoras/condensadoras-repository";
import { equipamento_status } from "../../interfaces/equipamentos/equipamentos-repository";

export class PrismaCondensadorasRepository implements CondensadorasRepository {
  
  async create({ codigo, modelo, status, modulo, quadro, local_instalacao }: CondensadoraCreateData) {
    return await prisma.condensadora.create({
      data: {
        codigo, 
        modelo, 
        status, 
        modulo, 
        quadro, 
        local_instalacao
      }
    });
  };

  async get() {
    const itens = await prisma.condensadora.findMany({
      orderBy: {
        codigo: "asc"
      }
    });
    return itens;
  };

  async find({ id }: CondensadoraFind ) {
    const condensadora = await prisma.condensadora.findUnique(
      {
        where: {
          id,
        }
      }
    );
    return condensadora;
  };

  async findByCodigo({ codigo }: CondensadoraFindByCodigo) {
    const condensadora = await prisma.condensadora.findFirst({
      where: {
        codigo
      }
    })

    return condensadora;
  }

  async delete({ id }: CondensadoraDelete){
    await prisma.condensadora.delete({
      where: {
        id,
      }
    });
  };

  async update({ id, codigo, modelo, status, status_anterior, modulo, quadro, local_instalacao }: CondensadoraUpdate){
    
    // Atualizando a condensadora
    const condensadora = await prisma.condensadora.update({
      where: {
        id,
      },
      data: {
        codigo, 
        modelo, 
        status, 
        status_anterior,
        modulo, 
        quadro, 
        local_instalacao
      }
    });

    // Buscando se há equipamento cadastrado com essa condensadora
    const equipamento = await prisma.equipamento.findFirst({
      where: {
        id_condensadora: id
      }
    });

    // Caso exista ...
    if(equipamento) {

      // Variável de controle do status do equipamento a ser atualizado
      let status_equip: equipamento_status;
      status_equip = Object(equipamento).status;

      // Verifica o status da evaporadora
      if (status) {
        
        if (status == "defeito") {
          const evaporadora = await prisma.evaporadora.findFirst({
            where: {
              id: equipamento.id_evaporadora,
            }
          });

          if(Object(evaporadora).status != "parado") {
            status_equip = "defeito";
          }
        }

        if (status == "parado") {
          status_equip = "parado";
        }

        if (status == "normal") {
          const evaporadora = await prisma.evaporadora.findFirst({
            where: {
              id: equipamento.id_evaporadora,
            }
          });

          if(Object(evaporadora).status == "normal") {
            status_equip = "normal";
          }
          else {
            status_equip = Object(evaporadora).status;
          }
        }
      }

      // Atualizando o código do equipamento
      await prisma.equipamento.update({
        where: {
          id: equipamento.id,
        },
        data: {
          codigo,
          status: status_equip
        }
      })
    }

    return condensadora;
  };

}