import { ItensRepository } from "../../repositories/interfaces/itens/itens-repository";
import { TarefasRepository } from "../../repositories/interfaces/tarefas/tarefas-repository";

// Interface
interface GetTarefasByItemRequest {
  id_item: string;
}

// Service
export class GetTarefasByItemService {
  
  // Recebendo o repositório no construtor
  constructor(
    private tarefasRepository: TarefasRepository,
    private itensRepository: ItensRepository,
  ) {}

  // Executando o service
  async execute(request: GetTarefasByItemRequest) {
    
    // Dados do service
    const { id_item } = request;

    if(!(await this.itensRepository.find({ id: id_item }))) {
      return new Error("Item não existente")
    }

    // Buscando ...
    const tarefas = await this.tarefasRepository.getByItem({ id_item });

    // Se não tiver tenhuma tarefa com esse id
    if(Object.keys(tarefas).length == 0) {
      // Retorna erro
      return new Error("Sem tarefas desde item!");
    }
    // Retornando dado para o controller ...
    return tarefas;
  }
}