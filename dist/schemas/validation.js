"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idParamSchema = exports.updatePedidoItemSchema = exports.createPedidoItemSchema = exports.updatePedidoSchema = exports.createPedidoSchema = exports.updateClienteSchema = exports.createClienteSchema = exports.updateProdutoSchema = exports.createProdutoSchema = exports.updateCategoriaSchema = exports.createCategoriaSchema = void 0;
const zod_1 = require("zod");
// ==============================
// Schema para Categoria
// ==============================
exports.createCategoriaSchema = zod_1.z.object({
    nome: zod_1.z
        .string()
        .min(2, "Nome da categoria deve ter pelo menos 2 caracteres")
        .max(100, "Nome da categoria deve ter no máximo 100 caracteres"),
});
exports.updateCategoriaSchema = exports.createCategoriaSchema.partial();
// ==============================
// Schema para Produto
// ==============================
exports.createProdutoSchema = zod_1.z.object({
    nome: zod_1.z
        .string()
        .min(2, "Nome do produto deve ter pelo menos 2 caracteres")
        .max(150, "Nome do produto deve ter no máximo 150 caracteres"),
    preco: zod_1.z
        .number()
        .positive("Preço deve ser um número positivo"),
    estoque: zod_1.z
        .number()
        .int("Estoque deve ser um número inteiro")
        .nonnegative("Estoque não pode ser negativo"),
    categoriaId: zod_1.z
        .number()
        .int("ID da categoria deve ser um número inteiro")
        .positive("ID da categoria deve ser positivo"),
});
exports.updateProdutoSchema = exports.createProdutoSchema.partial();
// ==============================
// Schema para Cliente
// ==============================
exports.createClienteSchema = zod_1.z.object({
    nome: zod_1.z
        .string()
        .min(2, "Nome deve ter pelo menos 2 caracteres")
        .max(100, "Nome deve ter no máximo 100 caracteres"),
    email: zod_1.z
        .string()
        .email({ message: "Email deve ter um formato válido" })
        .max(255, "Email deve ter no máximo 255 caracteres"),
    cpf: zod_1.z
        .string()
        .length(11, "CPF deve ter exatamente 11 dígitos")
        .regex(/^\d+$/, "CPF deve conter apenas números"),
    telefone: zod_1.z
        .string()
        .min(10, "Telefone deve ter pelo menos 10 caracteres")
        .max(15, "Telefone deve ter no máximo 15 caracteres")
        .optional(),
});
exports.updateClienteSchema = exports.createClienteSchema.partial();
// ==============================
// Schema para Pedido
// ==============================
exports.createPedidoSchema = zod_1.z.object({
    clienteId: zod_1.z
        .number()
        .int("ID do cliente deve ser um número inteiro")
        .positive("ID do cliente deve ser positivo"),
    dataPedido: zod_1.z
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
exports.updatePedidoSchema = exports.createPedidoSchema.partial();
// ==============================
// Schema para PedidoItem (opcional)
// ==============================
exports.createPedidoItemSchema = zod_1.z.object({
    pedidoId: zod_1.z
        .number()
        .int("ID do pedido deve ser um número inteiro")
        .positive("ID do pedido deve ser positivo"),
    produtoId: zod_1.z
        .number()
        .int("ID do produto deve ser um número inteiro")
        .positive("ID do produto deve ser positivo"),
    quantidade: zod_1.z
        .number()
        .int("Quantidade deve ser um número inteiro")
        .positive("Quantidade deve ser positiva"),
    precoUnitario: zod_1.z
        .number()
        .positive("Preço unitário deve ser positivo"),
});
exports.updatePedidoItemSchema = exports.createPedidoItemSchema.partial();
// ==============================
// Schema para validação de IDs
// ==============================
exports.idParamSchema = zod_1.z.object({
    id: zod_1.z
        .string()
        .regex(/^\d+$/, "ID deve ser um número válido")
        .transform(Number)
        .refine((num) => num > 0, "ID deve ser positivo"),
});
