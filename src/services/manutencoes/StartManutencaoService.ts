import { ManutencoesRepository } from "../../repositories/interfaces/manutencoes/manutencoes-repository";
import { RelatoriosRepository } from "../../repositories/interfaces/relatorios/relatorios-repository";

// Interface
interface StartManutencaoRequest {
    id: string;
    iniciar: boolean;
}

// Service
export class StartManutencaoService {
  
  // Recebendo o repositório no construtor
  constructor(
    private manutencoesRepository: ManutencoesRepository,
    private relatoriosRepository: RelatoriosRepository
  ) {}

  // Executando o service
  async execute(request: StartManutencaoRequest) {

    // Dados do service
    const { id, iniciar } = request;

    // Buscando para verificar se a manutenção existe
    const manutencao = await this.manutencoesRepository.find({ id });

    if (!manutencao) {
        return new Error("Manutenção inexistente!");
    }

    // Se iniciar == true
    if (iniciar){
      
      // status
      const status_manu = "execucao";

      // Atualizad o status e salva
      try {
        await this.manutencoesRepository.start({
          id,
          status: status_manu
        })
      } catch (err) {
        return err;
      }
    }


    // Retornando a manutenção para o controller
    return manutencao;
  }
}