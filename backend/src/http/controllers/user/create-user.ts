import { FastifyReply, FastifyRequest } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

import { knex } from '@/database'
import { hash } from 'bcryptjs'

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const createUserBodySchema = z
    .object({
      first_name: z.string().nonempty(),
      email: z.string().email().nonempty(),
      password: z.string().min(6).optional(),
      login_provider: z.enum(['email', 'google', 'facebook'], {
        message: 'Invalid login provider',
      }),
      firebase_uid: z.string().optional(),
      profile_picture_url: z.string().optional(),
    })
    .refine(
      (data) => data.login_provider !== 'email' || !!data.password, // Valida que senha é obrigatória para login por e-mail
      {
        message: 'Password is required when login provider is email',
        path: ['password'], // Aponta para o campo que gerou o erro
      },
    )
    .refine(
      (data) => data.login_provider === 'email' || !!data.firebase_uid, // Valida que firebase_uid é obrigatório para login não por e-mail
      {
        message: 'Firebase UID is required when login provider is not email',
        path: ['firebase_uid'], // Aponta para o campo que gerou o erro
      },
    )

  const {
    email,
    first_name,
    password,
    login_provider,
    firebase_uid,
    profile_picture_url,
  } = createUserBodySchema.parse(request.body)

  const password_hash =
    login_provider === 'email' ? await hash(password as string, 6) : undefined

  try {
    await knex('users').insert({
      id: randomUUID(),
      email,
      password_hash,
      first_name,
      login_provider,
      firebase_uid,
      is_email_notifications_enabled: false,
      accepted_terms_at: new Date(),
      role: 'USER',
      created_at: new Date(),
      updated_at: new Date(),
      profile_picture_url,
    })
  } catch (error) {
    return reply.status(400).send({
      message: 'User already exists',
    })
  }

  return reply.status(201).send()
}
