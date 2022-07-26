import { SalasRepository } from "../../repositories/interfaces/salas/salas-repository";
import { SetoresRepository } from "../../repositories/interfaces/setores/setores-repository";

// Interface
interface CreateSalaRequest {
  nome: string;
  andar: string;
  dimensao?: string;
  id_setor?: string;
}

// Service
export class CreateSalaService {
  
  // Recebendo o repositório no construtor
  constructor(
    private setoresRepository: SetoresRepository,
    private salasRepository: SalasRepository,
  ) {}

  // Executando o service
  async execute(request: CreateSalaRequest) {
    
    // Dados do service
    const { nome, andar, dimensao, id_setor } = request;

    if(id_setor) {
      // Caso ele não encontre o setor inserido
      if(!(await this.setoresRepository.find({ id:id_setor }))) {
        
        // Retorna erro
        return new Error("Setor não existente!")
      }
    }

    // Criando ...
    await this.salasRepository.create({
      nome,
      andar, 
      dimensao,
      id_setor
    })
  }
}