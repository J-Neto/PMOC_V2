import { ItensRepository } from "../../repositories/interfaces/itens/itens-repository";

// Interface 
interface DeleteItemRequest {
  id:string;
}

// Service
export class DeleteItemService {
  
  // Recebendo o repositório no construtor
  constructor(
    private itensRepository: ItensRepository,
  ) {}

  // Executando o service
  async execute(request: DeleteItemRequest) {
    
    // Dados do service
    const { id } = request;

    // Buscando ...
    const item = await this.itensRepository.find({id})

    // Se não existir item
    if (!item) {
      return new Error("Item inexistente!");
    }

    // Deletando
    return this.itensRepository.delete({id});
  }
}