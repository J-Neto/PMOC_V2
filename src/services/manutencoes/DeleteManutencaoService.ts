import { CondensadorasRepository } from "../../repositories/interfaces/condensadoras/condensadoras-repository";
import { EvaporadorasRepository } from "../../repositories/interfaces/evaporadoras/evaporadoras-repository";
import { ManutencoesRepository } from "../../repositories/interfaces/manutencoes/manutencoes-repository";

// Interface
interface DeleteManutencaoRequest {
    id: string;
}

// Service
export class DeleteManutencaoService {
  
  // Recebendo o repositório no construtor
  constructor(
    private manutencoesRepository: ManutencoesRepository,
    private condensadorasRepository: CondensadorasRepository,
    private evaporadorasRepository: EvaporadorasRepository
  ) {}

  // Executando o service
  async execute(request: DeleteManutencaoRequest) {
    
    // Dados do service
    const { id } = request;

    // Buscando para verificar se a manutenção existe
    const manutencao = await this.manutencoesRepository.find({ id });

    if (!manutencao) {
        return new Error("Manutenção inexistente!");
    }

    // Agora iremos buscar os dispositivos atrelados a esta manutenção e reverter seus status para os anteriores
    const condensadora = await this.condensadorasRepository.find({ id: Object(manutencao).id_condensadora })
    const evaporadora = await this.evaporadorasRepository.find({ id: Object(manutencao).id_evaporadora })
    
    // Não iremos reverter o status caso o atual seja "parado"
    // Só iremos caso o atual seja "defeito" e o anterior seja "normal"

    // Se esta manutenção tiver condensadora
    if (condensadora) {

      // Iremos ver se o status atual é "defeito" e o anterior "normal"
      if (Object(condensadora).status == "defeito" && Object(condensadora).status_anterior == "normal") {

        // Vamos salvar o seu status
        const status = Object(condensadora).status;

        // Atualizando a condensadora
        await this.condensadorasRepository.update({
            id: Object(condensadora).id,
            status: Object(condensadora).status_anterior,
            status_anterior: status
        })
      }
    }

    // Se esta manutenção tiver evaporadora
    if (Object(evaporadora)) {

      // Iremos ver se o status atual é "defeito" e o anterior "normal"
      if (Object(evaporadora).status == "defeito" && Object(evaporadora).status_anterior == "normal") {
      
        // Vamos salvar o seu status
        const status_novo = Object(evaporadora).status;
  
        // Atualizando a evaporadora
        await this.evaporadorasRepository.update({
            id: Object(evaporadora).id,
            status: Object(evaporadora).status_anterior,
            status_anterior: status_novo
        })
      }
    }

    // Deletando a manutenção
    return this.manutencoesRepository.delete({ id });
  }
}