import { Request, Response } from 'express';
import { ClienteService } from '../services/clienteService';
import { ZodError } from 'zod';

const clienteService = new ClienteService();

export class ClienteController {
  async getAll(req: Request, res: Response) {
    try {
      const clientes = await clienteService.findAll();
      res.json(clientes);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar clientes' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const cliente = await clienteService.findById(parseInt(id));

      if (!cliente) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }

      res.json(cliente);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar cliente' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const cliente = await clienteService.create(req.body);
      res.status(201).json(cliente);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          error: 'Dados inválidos', 
          details: error.issues 
        });
      }
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Erro ao criar cliente' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const cliente = await clienteService.update(parseInt(id), req.body);
      res.json(cliente);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          error: 'Dados inválidos', 
          details: error.issues 
        });
      }
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Erro ao atualizar cliente' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await clienteService.delete(parseInt(id));
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Erro ao deletar cliente' });
    }
  }
}