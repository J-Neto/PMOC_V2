import { ItensRepository } from "../../repositories/interfaces/itens/itens-repository";

// Interface
interface CreateItemRequest {
  nome: string;
}

// Service
export class CreateItemService {
  
  // Recebendo o repositório no construtor
  constructor(
    private itensRepository: ItensRepository,
  ) {}

  // Executando o service
  async execute(request: CreateItemRequest) {
    
    // Dados do service
    const { nome } = request;

    // Se o usuário não inserir nome
    if (!nome) {
      return new Error("O campo nome é obrigatório!");
    }

    // Criando ...
    await this.itensRepository.create({
      nome,
    })
  }
}