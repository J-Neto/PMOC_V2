import { prisma } from "../../../prisma";
import { ItemCreateData, ItemDelete, ItemFind, ItensRepository, ItemUpdate} from "../../interfaces/itens/itens-repository";

export class PrismaItensRepository implements ItensRepository {
  
  async create({ nome }: ItemCreateData) {
    await prisma.item.create({
      data: {
        nome,
      }
    });
  };

  async get() {
    const itens = await prisma.item.findMany({
      orderBy: {
        nome: "asc"
      }
    });
    return itens;
  };

  async find({ id }: ItemFind ) {
    const item = await prisma.item.findUnique(
      {
        where: {
          id,
        }
      }
    );
    return item;
  };

  async delete({ id }: ItemDelete){
    await prisma.item.delete({
      where: {
        id,
      }
    });
  };

  async update({ id, nome }: ItemUpdate){
    await prisma.item.update({
      where: {
        id,
      },
      data: {
        nome,
      }
    })
  };

}