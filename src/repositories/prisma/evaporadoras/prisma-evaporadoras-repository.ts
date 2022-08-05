import { prisma } from "../../../prisma";
import { equipamento_status } from "../../interfaces/equipamentos/equipamentos-repository";
import { EvaporadoraCreateData, EvaporadoraDelete, EvaporadoraFind, EvaporadoraFindByCodigo, EvaporadorasRepository, EvaporadoraUpdate} from "../../interfaces/evaporadoras/evaporadoras-repository";

export class PrismaEvaporadorasRepository implements EvaporadorasRepository {
  
  async create({ codigo, modelo, marca, potencia, status, quadro, id_sala }: EvaporadoraCreateData) {
    return await prisma.evaporadora.create({
      data: {
        codigo, 
        modelo, 
        marca,
        potencia,
        status, 
        quadro, 
        id_sala
      }
    });
  };

  async get() {
    const itens = await prisma.evaporadora.findMany({
      orderBy: {
        codigo: "asc"
      }
    });
    return itens;
  };

  async find({ id }: EvaporadoraFind ) {
    const evaporadora = await prisma.evaporadora.findUnique(
      {
        where: {
          id,
        }
      }
    );
    return evaporadora;
  };

  async findByCodigo({ codigo }: EvaporadoraFindByCodigo) {
    const evaporadora = await prisma.evaporadora.findFirst({
      where: {
        codigo
      }
    })

    return evaporadora;
  }

  async delete({ id }: EvaporadoraDelete){
    await prisma.evaporadora.delete({
      where: {
        id,
      }
    });
  };

  async update({ id, codigo, modelo, marca, potencia, status, status_anterior, quadro, id_sala }: EvaporadoraUpdate){
    
    // Atualizando a evaporadora
    await prisma.evaporadora.update({
      where: {
        id,
      },
      data: {
        codigo, 
        modelo, 
        marca,
        potencia,
        status, 
        status_anterior,
        quadro, 
        id_sala
      }
    });

    // Buscando se há equipamento cadastrado com essa evaporadora
    const equipamento = await prisma.equipamento.findFirst({
      where: {
        id_evaporadora: id
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
          const condensadora = await prisma.condensadora.findFirst({
            where: {
              id: equipamento.id_condensadora,
            }
          });

          if(Object(condensadora).status != "parado") {
            status_equip = "defeito";
          }
        }

        if (status == "parado") {
          status_equip = "parado";
        }

        if (status == "normal") {
          const condensadora = await prisma.condensadora.findFirst({
            where: {
              id: equipamento.id_condensadora,
            }
          });

          if(Object(condensadora).status == "normal") {
            status_equip = "normal";
          }
          else {
            status_equip = Object(condensadora).status;
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
  };

}