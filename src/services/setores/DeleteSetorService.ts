import { SetoresRepository } from "../../repositories/interfaces/setores/setores-repository";

// Interface 
interface DeleteSetorRequest {
  id:string;
}

// Service
export class DeleteSetorService {
  
  // Recebendo o repositório no construtor
  constructor(
    private setoresRepository: SetoresRepository,
  ) {}

  // Executando o service
  async execute(request: DeleteSetorRequest) {
    
    // Dados do service
    const { id } = request;

    // Buscando ...
    const setor = await this.setoresRepository.find({id})

    // Se não existir
    if (!setor) {
      return new Error("Setor inexistente!");
    }

    // Deletando
    return this.setoresRepository.delete({id});
  }
}