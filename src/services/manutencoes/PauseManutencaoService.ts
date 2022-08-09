import { ManutencoesRepository } from "../../repositories/interfaces/manutencoes/manutencoes-repository";
import { RelatoriosRepository } from "../../repositories/interfaces/relatorios/relatorios-repository";

// Interface
interface PauseManutencaoRequest {
    id: string;
    pause: boolean;
    comentario: string;
}

// Service
export class PauseManutencaoService {
  
  // Recebendo o repositório no construtor
  constructor(
    private manutencoesRepository: ManutencoesRepository,
    private relatoriosRepository: RelatoriosRepository
  ) {}

  // Executando o service
  async execute(request: PauseManutencaoRequest) {

    // Dados do service
    const { id, pause, comentario } = request;

    // Buscando para verificar se a manutenção existe
    const manutencao = await this.manutencoesRepository.find({ id });

    if (!manutencao) {
        return new Error("Manutenção inexistente!");
    }

    // Se pause == true
    if (pause){
      
      // status
      const status_manu = "espera";

      // Atualizad o status e salva
      try {
        await this.manutencoesRepository.pause({
          id,
          status: status_manu,
          comentario
        })
      } catch (err) {
        return err;
      }
    }


    // Retornando a manutenção para o controller
    return manutencao;
  }
}