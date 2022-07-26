import { prisma } from "../../../prisma";
import { CondensadoraCreateData, CondensadoraDelete, CondensadoraFind, CondensadoraFindByCodigo, CondensadorasRepository, CondensadoraUpdate} from "../../interfaces/condensadoras/condensadoras-repository";

export class PrismaCondensadorasRepository implements CondensadorasRepository {
  
  async create({ codigo, modelo, status, modulo, quadro, local_instalacao }: CondensadoraCreateData) {
    await prisma.condensadora.create({
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

  async update({ id, codigo, modelo, status, modulo, quadro, local_instalacao }: CondensadoraUpdate){
    await prisma.condensadora.update({
      where: {
        id,
      },
      data: {
        codigo, 
        modelo, 
        status, 
        modulo, 
        quadro, 
        local_instalacao
      }
    })
  };

}