import { prisma } from "../../../prisma";
import { UsuarioCreateData, UsuarioDelete, UsuarioFind, UsuarioFindByEmail, UsuariosRepository, UsuarioUpdate} from "../../interfaces/usuarios/usuarios-repository";

export class PrismaUsuariosRepository implements UsuariosRepository {
  
  async create({ nome, email, nivel, senha }: UsuarioCreateData) {
    await prisma.usuario.create({
      data: {
        nome,
        email,
        nivel,
        senha
      }
    });
  };

  async get() {
    const usuarios = await prisma.usuario.findMany({
      orderBy: {
        nome: "asc"
      }
    });
    return usuarios;
  };

  async find({ id }: UsuarioFind ) {
    const usuario = await prisma.usuario.findUnique(
      {
        where: {
          id,
        },
      }
    );
    return usuario;
  };

  async findByEmail({ email }: UsuarioFindByEmail) {
    return await prisma.usuario.findFirst({
      where: {
        email,
      }
    })
  }

  async delete({ id }: UsuarioDelete){
    await prisma.usuario.delete({
      where: {
        id,
      }
    });
  };

  async update({ id, nome, email, nivel, senha }: UsuarioUpdate){
    await prisma.usuario.update({
      where: {
        id,
      },
      data: {
        nome,
        email,
        nivel,
        senha
      }
    })
  };

}