import { prisma } from "../../../prisma";
import { SalaCreateData, SalaDelete, SalaFind, SalasRepository, SalaUpdate} from "../../interfaces/salas/salas-repository";

export class PrismaSalasRepository implements SalasRepository {
  
  async create({ nome, andar, dimensao, id_setor }: SalaCreateData) {
    await prisma.sala.create({
      data: {
        nome,
        andar,
        dimensao,
        id_setor
      }
    });
  };

  async get() {
    const itens = await prisma.sala.findMany({
      orderBy: {
        nome: "asc"
      }
    });
    return itens;
  };

  async find({ id }: SalaFind ) {
    const sala = await prisma.sala.findUnique(
      {
        where: {
          id,
        }
      }
    );
    return sala;
  };

  async delete({ id }: SalaDelete){
    await prisma.sala.delete({
      where: {
        id,
      }
    });
  };

  async update({ id, nome, andar, dimensao, id_setor }: SalaUpdate){
    await prisma.sala.update({
      where: {
        id,
      },
      data: {
        nome,
        andar,
        dimensao,
        id_setor
      }
    })
  };

}