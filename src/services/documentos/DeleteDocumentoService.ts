import { DocumentosRepository } from "../../repositories/interfaces/documentos/documentos-repository";

// Interface
interface DeleteDocumentoRequest {
  id: string;
}

// Service
export class DeleteDocumentoService {
  
  // Recebendo o repositório no construtor
  constructor(
    private documentosRepository: DocumentosRepository,
  ) {}

  // Executando o service
  async execute(request: DeleteDocumentoRequest) {
    
    // Dados do service
    const { id } = request;

    if (!(await this.documentosRepository.find({ id }))){
      return new Error("Documento inexistente!")
    }

    // Criando ...
    return await this.documentosRepository.delete({
        id,
    })
  }
}