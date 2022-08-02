import { DocumentosRepository } from "../../repositories/interfaces/documentos/documentos-repository";

// Interface
interface CreateDocumentoRequest {
  path: string;
  filename: string;
  originalName: string;
  fileFormat: string;
}

// Service
export class CreateDocumentoService {
  
  // Recebendo o repositório no construtor
  constructor(
    private documentosRepository: DocumentosRepository,
  ) {}

  // Executando o service
  async execute(request: CreateDocumentoRequest) {
    
    // Dados do service
    const { path, filename, originalName, fileFormat } = request;

    // Se o usuário não inserir nome
    if (!path || !filename || !originalName || !fileFormat) {
      return new Error("Os campos são obrigatórios!");
    }

    // Criando ...
    return await this.documentosRepository.create({
        path, 
        filename, 
        originalName, 
        fileFormat,
    })
  }
}