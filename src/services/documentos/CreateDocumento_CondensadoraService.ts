import { DocumentoCondensadorasRepository } from "../../repositories/interfaces/documentos/documentos_condensadoras-repository";

// Interface
interface CreateDocumento_CondensadoraRequest {
  id_doc: string;
  id_condensadora: string;
}

// Service
export class CreateDocumento_CondensadoraService {
  
  // Recebendo o repositório no construtor
  constructor(
    private documentoCondensadorasRepository: DocumentoCondensadorasRepository,
  ) {}

  // Executando o service
  async execute(request: CreateDocumento_CondensadoraRequest) {
    
    // Dados do service
    const { id_doc, id_condensadora } = request;

    // Criando ...
    try {
      await this.documentoCondensadorasRepository.create({
          id_doc,
          id_condensadora
      })

    } catch (err) {
      return err;
    }
  }
}