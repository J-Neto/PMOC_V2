import { DocumentoManutencoesRepository } from "../../repositories/interfaces/documentos/documentos_manutencoes-repository";

// Interface
interface CreateDocumento_ManutencaoRequest {
  id_doc: string;
  id_manutencao: string;
}

// Service
export class CreateDocumento_ManutencaoService {
  
  // Recebendo o repositório no construtor
  constructor(
    private documentoManutencoesRepository: DocumentoManutencoesRepository,
  ) {}

  // Executando o service
  async execute(request: CreateDocumento_ManutencaoRequest) {
    
    // Dados do service
    const { id_doc, id_manutencao } = request;

    // Criando ...
    try {
      await this.documentoManutencoesRepository.create({
          id_doc,
          id_manutencao
      })

    } catch (err) {
      return err;
    }
  }
}