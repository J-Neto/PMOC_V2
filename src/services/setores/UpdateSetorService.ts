import { SetoresRepository } from "../../repositories/interfaces/setores/setores-repository";

// Interface
interface UpdateSetorRequest {
  id:string;
  nome?: string;
}

// Service
export class UpdateSetorService {
  
  // Recebendo o repositório no construtor
  constructor(
    private setoresRepository: SetoresRepository,
  ) {}

  // Executando o service
  async execute(request: UpdateSetorRequest) {
    
    // Dados do service
    const { id, nome } = request;

    // Se o setor não existir, retorna erro
    if (!(await this.setoresRepository.find({id}))) {
      return new Error("Setor inexistente!");
    }

    // Atualizando ...
    await this.setoresRepository.update({
      id,
      nome,
    })
  }
}