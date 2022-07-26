import { TarefasRepository } from "../../repositories/interfaces/tarefas/tarefas-repository";
import { tarefa_frequencia, tarefa_type } from "../../repositories/interfaces/tarefas/tarefas-repository";
import { ItensRepository } from "../../repositories/interfaces/itens/itens-repository";

// Interface
interface CreateTarefaRequest {
  tipo: tarefa_type;
  id_item: string;
  descricao: string;
  frequencia: tarefa_frequencia;
}

// Service
export class CreateTarefaService {
  
  // Recebendo o repositório no construtor
  constructor(
    private tarefasRepository: TarefasRepository,
    private itensRepository: ItensRepository,
  ) {}

  // Executando o service
  async execute(request: CreateTarefaRequest) {
    
    // Dados do service
    const { tipo, id_item, descricao, frequencia } = request;

    // Caso ele não encontre nenhum item existente
    if(!(await this.itensRepository.find({ id:id_item }))) {
      
      // Retorna erro
      return new Error("Item não existente!")
    }

    // Criando ...
    await this.tarefasRepository.create({
      tipo, 
      id_item, 
      descricao, 
      frequencia
    })
  }
}