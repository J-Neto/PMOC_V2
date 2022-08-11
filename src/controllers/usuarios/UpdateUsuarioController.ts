import { Request, Response } from "express";
import { PrismaUsuariosRepository } from "../../repositories/prisma/usuarios/prisma-usuarios-repository";
import { UpdateUsuarioService } from "../../services/usuarios/UpdateUsuarioService";

class UpdateUsuarioController {
  async handle(req:Request, res:Response) {

    // Dados do parâmetro da requisição
    const { id } = req.params;

    // Dados do corpo da requisição
    const { nome, email, nivel, senha } = req.body;

    // Repositório do modelo do Prisma
    const prismaUsuariosRepository = new PrismaUsuariosRepository();

    // Service 
    const updateUsuarioService = new UpdateUsuarioService(prismaUsuariosRepository);

    // Executando o service
    const usuario = await updateUsuarioService.execute({
      id,
      nome, 
      email, 
      nivel, 
      senha
    })

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(usuario instanceof Error) {
      return res.status(400).send(usuario.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(200).send(
      {
        message:"Usuário atualizado com sucesso!",
      }
    );
  }
}

export { UpdateUsuarioController };