import { DocumentosRepository } from "../../repositories/interfaces/documentos/documentos-repository";

// Service
export class GetDocumentosService {
  
  // Recebendo o repositório no construtor
  constructor(
    private documentosRepository: DocumentosRepository,
  ) {}

  // Executando o service
  async execute() {
    
    // Buscando ...
    const documentos = await this.documentosRepository.get()

    // Se não existir
    if (Object.keys(documentos).length == 0) {
      return new Error("Nenhum documento cadastrado!")
    } 

    // Retornando dado para o controller
    return documentos;
  }
}