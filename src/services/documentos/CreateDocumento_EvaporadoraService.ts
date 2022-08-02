import { DocumentoEvaporadorasRepository } from "../../repositories/interfaces/documentos/documentos_evaporadoras-repository";

// Interface
interface CreateDocumento_EvaporadoraRequest {
  id_doc: string;
  id_evaporadora: string;
}

// Service
export class CreateDocumento_EvaporadoraService {
  
  // Recebendo o repositório no construtor
  constructor(
    private documentoEvaporadorasRepository: DocumentoEvaporadorasRepository,
  ) {}

  // Executando o service
  async execute(request: CreateDocumento_EvaporadoraRequest) {
    
    // Dados do service
    const { id_doc, id_evaporadora } = request;

    // Criando ...
    try {
      await this.documentoEvaporadorasRepository.create({
          id_doc,
          id_evaporadora
      })

    } catch (err) {
      return err;
    }
  }
}