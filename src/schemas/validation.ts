import { z } from "zod";

// ==============================
// Schema para Categoria
// ==============================
export const createCategoriaSchema = z.object({
  nome: z
    .string()
    .min(2, "Nome da categoria deve ter pelo menos 2 caracteres")
    .max(100, "Nome da categoria deve ter no máximo 100 caracteres"),
});

export const updateCategoriaSchema = createCategoriaSchema.partial();

// ==============================
// Schema para Produto
// ==============================
export const createProdutoSchema = z.object({
  nome: z
    .string()
    .min(2, "Nome do produto deve ter pelo menos 2 caracteres")
    .max(150, "Nome do produto deve ter no máximo 150 caracteres"),
  preco: z
    .number()
    .positive("Preço deve ser um número positivo"),
  estoque: z
    .number()
    .int("Estoque deve ser um número inteiro")
    .nonnegative("Estoque não pode ser negativo"),
  categoriaId: z
    .number()
    .int("ID da categoria deve ser um número inteiro")
    .positive("ID da categoria deve ser positivo"),
});

export const updateProdutoSchema = createProdutoSchema.partial();

/* Filtro para busca de produtos (usado no getAll do controller)
export const getProductsQuerySchema = z.object({
  categoriaId: z
    .string()
    .transform((val) => (val ? Number(val) : undefined))
    .refine((val) => val === undefined || (!isNaN(val) && val > 0), {
      message: "categoriaId deve ser um número positivo",
    })
    .optional(),
});*/

export const getProductsQuerySchema = z.object({
  categoriaId: z.coerce.number().optional(),
});

// ==============================
// Schema para Cliente
// ==============================
export const createClienteSchema = z.object({
  nome: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  email: z
    .string()
    .email({ message: "Email deve ter um formato válido" })
    .max(255, "Email deve ter no máximo 255 caracteres"),
  cpf: z
    .string()
    .length(11, "CPF deve ter exatamente 11 dígitos")
    .regex(/^\d+$/, "CPF deve conter apenas números"),
  telefone: z
    .string()
    .min(10, "Telefone deve ter pelo menos 10 caracteres")
    .max(15, "Telefone deve ter no máximo 15 caracteres")
    .optional(),
});

export const updateClienteSchema = createClienteSchema.partial();

// ==============================
// Schema para Pedido
// ==============================
export const createPedidoSchema = z.object({
  clienteId: z
    .number()
    .int("ID do cliente deve ser um número inteiro")
    .positive("ID do cliente deve ser positivo"),
  dataPedido: z
    .string()
    .refine((date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }, "Data do pedido deve ser uma data válida")
    .refine((date) => {
      const parsedDate = new Date(date);
      const now = new Date();
      return parsedDate <= now;
    }, "Data do pedido não pode ser no futuro"),
});

export const updatePedidoSchema = createPedidoSchema.partial();

// ==============================
// Schema para PedidoItem (opcional)
// ==============================
export const createPedidoItemSchema = z.object({
  pedidoId: z
    .number()
    .int("ID do pedido deve ser um número inteiro")
    .positive("ID do pedido deve ser positivo"),
  produtoId: z
    .number()
    .int("ID do produto deve ser um número inteiro")
    .positive("ID do produto deve ser positivo"),
  quantidade: z
    .number()
    .int("Quantidade deve ser um número inteiro")
    .positive("Quantidade deve ser positiva"),
  precoUnitario: z
    .number()
    .positive("Preço unitário deve ser positivo"),
});

export const updatePedidoItemSchema = createPedidoItemSchema.partial();

// ==============================
// Schema para validação de IDs
// ==============================
export const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "ID deve ser um número válido")
    .transform(Number)
    .refine((num) => num > 0, "ID deve ser positivo"),
});

// ==============================
// Tipos TypeScript derivados dos schemas
// ==============================
export type CreateCategoriaData = z.infer<typeof createCategoriaSchema>;
export type UpdateCategoriaData = z.infer<typeof updateCategoriaSchema>;

export type CreateProdutoData = z.infer<typeof createProdutoSchema>;
export type UpdateProdutoData = z.infer<typeof updateProdutoSchema>;

export type CreateClienteData = z.infer<typeof createClienteSchema>;
export type UpdateClienteData = z.infer<typeof updateClienteSchema>;

export type CreatePedidoData = z.infer<typeof createPedidoSchema>;
export type UpdatePedidoData = z.infer<typeof updatePedidoSchema>;

export type CreatePedidoItemData = z.infer<typeof createPedidoItemSchema>;
export type UpdatePedidoItemData = z.infer<typeof updatePedidoItemSchema>;

export type IdParam = z.infer<typeof idParamSchema>;
