import { ItensRepository } from "../../repositories/interfaces/itens/itens-repository";

// Interface do updateItem
interface FindItemRequest {
  id:string;
}

// Service
export class FindItemService {
  
  // Recebendo o repositório no construtor
  constructor(
    private itensRepository: ItensRepository,
  ) {}

  // Executando o service
  async execute(request: FindItemRequest) {
    
    // Dados do service
    const { id } = request;

    // Buscando ...
    const item = await this.itensRepository.find({id})

    // Se não existir item
    if (!item) {
      return new Error("Item inexistente!");
    }

    // Retornando dado para o controller
    return item;
  }
}