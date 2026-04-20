"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSchema = exports.blockSchema = exports.registerSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
// 1. Login Schema
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string()
        .min(1, 'Email is required')
        .email('Invalid email format'), // This belongs to 'email'
    password: zod_1.z.string()
        .min(6, 'Password must be at least 6 characters'),
});
// 2. Register Schema
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string()
        .min(2, 'Name must be at least 2 characters'),
    email: zod_1.z.string()
        .min(1, 'Email is required')
        .email('Invalid email format'),
    password: zod_1.z.string()
        .min(6, 'Password must be at least 6 characters'),
});
exports.blockSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    type: zod_1.z.enum(['heading', 'text', 'code']),
    content: zod_1.z.string().min(1, 'Block content cannot be empty'),
    metadata: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
});
exports.postSchema = zod_1.z.object({
    title: zod_1.z.string().min(5, 'Title must be at least 5 characters'),
    description: zod_1.z.string().optional(),
    blocks: zod_1.z.array(exports.blockSchema).min(1, 'Post must have at least one block'),
    status: zod_1.z.enum(['draft', 'published']),
});
