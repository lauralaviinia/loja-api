import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schemas de validação
export const ClienteCreateSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(100),
  email: z.string().email('Email inválido').max(100),
  cpf: z.string().length(11, 'CPF deve ter exatamente 11 dígitos').regex(/^\d+$/, 'CPF deve conter apenas números'),
  telefone: z.string().max(20).optional(),
});

export const ClienteUpdateSchema = ClienteCreateSchema.partial();

export class ClienteService {
  
  async findAll() {
    try {
      return await prisma.cliente.findMany({
        include: {
          pedidos: {
            select: {
              id: true,
              data: true,
              total: true,
              status: true
            },
            orderBy: {
              data: 'desc'
            },
            take: 5
          }
        },
        orderBy: {
          nome: 'asc'
        }
      });
    } catch (error) {
      throw new Error('Erro ao buscar clientes');
    }
  }

  async findById(id: number) {
    try {
      return await prisma.cliente.findUnique({
        where: { id },
        include: {
          pedidos: {
            include: {
              items: {
                include: {
                  produto: {
                    include: {
                      categoria: true
                    }
                  }
                }
              }
            },
            orderBy: {
              data: 'desc'
            }
          }
        }
      });
    } catch (error) {
      throw new Error('Erro ao buscar cliente');
    }
  }

  async create(data: any) {
    try {
      const validatedData = ClienteCreateSchema.parse(data);

      // Verificar se email já existe
      const existingEmail = await prisma.cliente.findUnique({
        where: { email: validatedData.email }
      });

      if (existingEmail) {
        throw new Error('Email já cadastrado');
      }

      // Verificar se CPF já existe
      const existingCpf = await prisma.cliente.findUnique({
        where: { cpf: validatedData.cpf }
      });

      if (existingCpf) {
        throw new Error('CPF já cadastrado');
      }

      return await prisma.cliente.create({
        data: validatedData
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Dados inválidos: ${error.issues.map(e => e.message).join(', ')}`);
      }
      throw error;
    }
  }

  async update(id: number, data: any) {
    try {
      const validatedData = ClienteUpdateSchema.parse(data);

      // Verificar se cliente existe
      const cliente = await this.findById(id);
      if (!cliente) {
        throw new Error('Cliente não encontrado');
      }

      // Se estiver atualizando o email, verificar duplicata
      if (validatedData.email && validatedData.email !== cliente.email) {
        const existingEmail = await prisma.cliente.findUnique({
          where: { email: validatedData.email }
        });

        if (existingEmail) {
          throw new Error('Email já cadastrado');
        }
      }

      // Se estiver atualizando o CPF, verificar duplicata
      if (validatedData.cpf && validatedData.cpf !== cliente.cpf) {
        const existingCpf = await prisma.cliente.findUnique({
          where: { cpf: validatedData.cpf }
        });

        if (existingCpf) {
          throw new Error('CPF já cadastrado');
        }
      }

      return await prisma.cliente.update({
        where: { id },
        data: validatedData
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Dados inválidos: ${error.issues.map(e => e.message).join(', ')}`);
      }
      throw error;
    }
  }

  async delete(id: number) {
    try {
      // Verificar se cliente existe
      const cliente = await this.findById(id);
      if (!cliente) {
        throw new Error('Cliente não encontrado');
      }

      // Verificar se existem pedidos associados
      const pedidosCount = await prisma.pedido.count({
        where: { clienteId: id }
      });

      if (pedidosCount > 0) {
        throw new Error('Não é possível excluir cliente com pedidos associados');
      }

      await prisma.cliente.delete({
        where: { id }
      });
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string) {
    try {
      return await prisma.cliente.findUnique({
        where: { email },
        include: {
          pedidos: {
            include: {
              items: {
                include: {
                  produto: true
                }
              }
            }
          }
        }
      });
    } catch (error) {
      throw new Error('Erro ao buscar cliente por email');
    }
  }

  async count() {
    try {
      return await prisma.cliente.count();
    } catch (error) {
      throw new Error('Erro ao contar clientes');
    }
  }
}