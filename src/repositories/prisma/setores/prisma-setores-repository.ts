import { prisma } from "../../../prisma";
import { SetorCreateData, SetorDelete, SetorFind, SetoresRepository, SetorUpdate} from "../../interfaces/setores/setores-repository";

export class PrismaSetoresRepository implements SetoresRepository {
  
  async create({ nome }: SetorCreateData) {
    await prisma.setor.create({
      data: {
        nome,
      }
    });
  };

  async get() {
    const itens = await prisma.setor.findMany({
      orderBy: {
        nome: "asc"
      }
    });
    return itens;
  };

  async find({ id }: SetorFind ) {
    const setor = await prisma.setor.findUnique(
      {
        where: {
          id,
        }
      }
    );
    return setor;
  };

  async delete({ id }: SetorDelete){
    await prisma.setor.delete({
      where: {
        id,
      }
    });
  };

  async update({ id, nome }: SetorUpdate){
    await prisma.setor.update({
      where: {
        id,
      },
      data: {
        nome,
      }
    })
  };

}