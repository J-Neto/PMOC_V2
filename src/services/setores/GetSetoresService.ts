import { SetoresRepository } from "../../repositories/interfaces/setores/setores-repository";

// Service
export class GetSetoresService {
  
  // Recebendo o repositório no construtor
  constructor(
    private setoresRepository: SetoresRepository,
  ) {}

  // Executando o service
  async execute() {
    
    // Buscando ...
    const setores = await this.setoresRepository.get()

    // Se não existir setor
    if (Object.keys(setores).length == 0) {
      return new Error("Nenhum setor cadastrado!")
    } 

    // Retornando dado para o controller
    return setores;
  }
}