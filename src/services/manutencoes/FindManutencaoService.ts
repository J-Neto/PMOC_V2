import { CondensadorasRepository } from "../../repositories/interfaces/condensadoras/condensadoras-repository";
import { EvaporadorasRepository } from "../../repositories/interfaces/evaporadoras/evaporadoras-repository";
import { ManutencoesRepository } from "../../repositories/interfaces/manutencoes/manutencoes-repository";

// Interface
interface FindManutencaoRequest {
    id: string;
}

// Service
export class FindManutencaoService {
  
  // Recebendo o repositório no construtor
  constructor(
    private manutencoesRepository: ManutencoesRepository,
  ) {}

  // Executando o service
  async execute(request: FindManutencaoRequest) {
    
    // Dados do service
    const { id } = request;

    // Buscando para verificar se a manutenção existe
    const manutencao = await this.manutencoesRepository.find({ id });

    if (!manutencao) {
        return new Error("Manutenção inexistente!");
    }

    // Retornando a manutenção para o controller
    return manutencao
  }
}