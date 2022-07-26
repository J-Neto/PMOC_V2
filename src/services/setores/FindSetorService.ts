import { SetoresRepository } from "../../repositories/interfaces/setores/setores-repository";

// Interface
interface FindSetorRequest {
  id:string;
}

// Service
export class FindSetorService {
  
  // Recebendo o repositório no construtor
  constructor(
    private setoresRepository: SetoresRepository,
  ) {}

  // Executando o service
  async execute(request: FindSetorRequest) {
    
    // Dados do service
    const { id } = request;

    // Buscando ...
    const setor = await this.setoresRepository.find({id})

    // Se não existir setor
    if (!setor) {
      return new Error("setor inexistente!");
    }

    // Retornando dado para o controller
    return setor;
  }
}