import { ItensRepository } from "../../repositories/interfaces/itens/itens-repository";

// Service
export class GetItensService {
  
  // Recebendo o repositório no construtor
  constructor(
    private itensRepository: ItensRepository,
  ) {}

  // Executando o service
  async execute() {
    
    // Buscando ...
    const itens = await this.itensRepository.get()

    // Se não existir item
    if (Object(itens).length == 0) {
      return new Error("Nenhum item cadastrado!")
    } 

    // Retornando dado para o controller
    return itens;
  }
}