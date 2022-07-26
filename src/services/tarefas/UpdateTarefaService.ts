import { TarefasRepository } from "../../repositories/interfaces/tarefas/tarefas-repository";
import { tarefa_frequencia, tarefa_type } from "../../repositories/interfaces/tarefas/tarefas-repository";
import { ItensRepository } from "../../repositories/interfaces/itens/itens-repository";

// Interface
interface UpdateTarefaRequest {
  id: string;
  tipo?: tarefa_type;
  id_item?: string;
  descricao?: string;
  frequencia?: tarefa_frequencia;
}

// Service
export class UpdateTarefaService {
  
  // Recebendo o repositório no construtor
  constructor(
    private tarefasRepository: TarefasRepository,
    private itensRepository: ItensRepository,
  ) {}

  // Executando o service
  async execute(request: UpdateTarefaRequest) {
    
    // Dados do service
    const { id, tipo, id_item, descricao, frequencia } = request;

    // Se não tiver tenhuma tarefa com esse id
    if(!(await this.tarefasRepository.find({ id }))) {
      // Retorna erro
      return new Error("Tarefa não existente!");
    }

    if (id_item) {
      // Caso ele não encontre nenhum item existente
      if(!(await this.itensRepository.find({ id:id_item }))) {
        // Retorna erro
        return new Error("Item não existente!")
      }
    }

    // Atualizando ...
    await this.tarefasRepository.update({
      id,
      tipo, 
      id_item, 
      descricao, 
      frequencia
    })
  }
}