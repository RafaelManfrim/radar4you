import { FastifyReply, FastifyRequest } from 'fastify'

export function verifyUserRole(roleToVerify: 'ADMIN' | 'USER') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user

    if (role !== roleToVerify) {
      return reply.code(403).send({ message: 'Forbiden' })
    }
  }
}
