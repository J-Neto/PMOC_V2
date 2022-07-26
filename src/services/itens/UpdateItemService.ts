import { ItensRepository } from "../../repositories/interfaces/itens/itens-repository";

// Interface
interface UpdateItemRequest {
  id:string;
  nome?: string;
}

// Service
export class UpdateItemService {
  
  // Recebendo o repositório no construtor
  constructor(
    private itensRepository: ItensRepository,
  ) {}

  // Executando o service
  async execute(request: UpdateItemRequest) {
    
    // Dados do service
    const { id, nome } = request;

    // Se o item não existir, retorna erro
    if (!(await this.itensRepository.find({id}))) {
      return new Error("Item inexistente!");
    }

    // Atualizando ...
    await this.itensRepository.update({
      id,
      nome,
    })
  }
}