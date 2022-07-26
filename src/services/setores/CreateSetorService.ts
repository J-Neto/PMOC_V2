import { SetoresRepository } from "../../repositories/interfaces/setores/setores-repository";

// Interface
interface CreateSetorRequest {
  nome: string;
}

// Service
export class CreateSetorService {
  
  // Recebendo o repositório no construtor
  constructor(
    private setoresRepository: SetoresRepository,
  ) {}

  // Executando o service
  async execute(request: CreateSetorRequest) {
    
    // Dados do service
    const { nome } = request;

    // Se o usuário não inserir nome
    if (!nome) {
      return new Error("O campo nome é obrigatório!");
    }

    // Criando ...
    await this.setoresRepository.create({
      nome,
    })
  }
}