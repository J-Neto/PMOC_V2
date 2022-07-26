import { prisma } from "../../../prisma";
import { TarefaCreateData, TarefaDelete, TarefaFind, TarefaGetByItem, TarefasRepository, TarefaUpdate} from "../../interfaces/tarefas/tarefas-repository";

export class PrismaTarefasRepository implements TarefasRepository {
  
  async create({ tipo, id_item, descricao, frequencia }: TarefaCreateData) {
    await prisma.tarefa.create({
      data: {
        tipo, 
        id_item, 
        descricao, 
        frequencia
      }
    });
  };

  async get() {
    const tarefas = await prisma.tarefa.findMany({
      orderBy: {
        descricao: "asc"
      }
    });
    return tarefas;
  };

  async getByItem({ id_item }: TarefaGetByItem) {
    const tarefas = await prisma.tarefa.findMany(
      {
        where: {
          id_item
        }
      }
    );

    return tarefas;
  }

  async find({ id }: TarefaFind ) {
    const tarefa = await prisma.tarefa.findUnique(
      {
        where: {
          id,
        },
        include: {
          item: true
        }
      }
    );
    return tarefa;
  };

  async delete({ id }: TarefaDelete){
    await prisma.tarefa.delete({
      where: {
        id,
      }
    });
  };

  async update({ id, tipo, id_item, descricao, frequencia }: TarefaUpdate){
    await prisma.tarefa.update({
      where: {
        id,
      },
      data: {
        tipo, 
        id_item, 
        descricao, 
        frequencia
      }
    })
  };

}