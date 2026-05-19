import { body, param } from 'express-validator';

export const mongoIdValidator = (field = 'id') => [
  param(field).isMongoId().withMessage(`Invalid ${field}`),
];

export const projectValidator = [
  body('name').trim().notEmpty().withMessage('Project name is required')
    .isLength({ max: 100 }).withMessage('Name too long'),
  body('description').optional().isLength({ max: 2000 }),
  body('status').optional().isIn(['planning', 'active', 'on_hold', 'completed', 'cancelled']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
];

export const taskValidator = [
  body('title').trim().notEmpty().withMessage('Task title is required')
    .isLength({ max: 200 }).withMessage('Title too long'),
  body('project').notEmpty().withMessage('Project is required').isMongoId(),
  body('status').optional().isIn(['todo', 'in_progress', 'in_review', 'completed']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
];

export const commentValidator = [
  body('content').trim().notEmpty().withMessage('Comment cannot be empty')
    .isLength({ max: 2000 }).withMessage('Comment too long'),
];

export const teamValidator = [
  body('name').trim().notEmpty().withMessage('Team name is required')
    .isLength({ max: 80 }),
];