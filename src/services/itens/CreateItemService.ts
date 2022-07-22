import { ItensRepository } from "../../repositories/interfaces/itens/itens-repository";

// Interface do createItem
interface CreateItemRequest {
  nome: string;
}

// Service
export class CreateItemService {
  
  // Recebendo o repositório da tag no construtor
  constructor(
    private tagsRepository: ItensRepository,
  ) {}

  // Executando o service
  async execute(request: CreateItemRequest) {
    
    // Dados do service
    const { nome } = request;

    // Se o usuário não inserir nome
    if (!nome) {
      return new Error("O campo nome é obrigatório!");
    }

    // Criando a tag ...
    await this.tagsRepository.create({
      nome,
    })
  }
}