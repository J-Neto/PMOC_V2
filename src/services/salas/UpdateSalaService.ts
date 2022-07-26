import { SalasRepository } from "../../repositories/interfaces/salas/salas-repository";
import { SetoresRepository } from "../../repositories/interfaces/setores/setores-repository";

// Interface
interface UpdateSalaRequest {
  id: string;
  nome?: string;
  andar?: string;
  dimensao?: string;
  id_setor?: string;
}

// Service
export class UpdateSalaService {
  
  // Recebendo o repositório no construtor
  constructor(
    private setoresRepository: SetoresRepository,
    private salasRepository: SalasRepository,
  ) {}

  // Executando o service
  async execute(request: UpdateSalaRequest) {
    
    // Dados do service
    const { id, nome, andar, dimensao, id_setor } = request;

    // Se não existir a sala a ser atualizada, retorna erro
    if(!(await this.salasRepository.find({ id }))) {
      return new Error("Sala não existente!")
    }


    if(id_setor) {
      // Caso ele não encontre o setor inserido
      if(!(await this.setoresRepository.find({ id:id_setor }))) {
        
        // Retorna erro
        return new Error("Setor não existente!")
      }
    }

    // Atualizando ...
    await this.salasRepository.update({
      id,
      nome,
      andar, 
      dimensao,
      id_setor
    })
  }
}