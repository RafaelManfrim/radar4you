import { FastifyReply, FastifyRequest } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import xlsx from 'xlsx'

import { knex } from '@/database'

const XLSX_MIME_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

const xlsxFileSchema = z.object({
  mimetype: z.literal(XLSX_MIME_TYPE, {
    errorMap: () => ({
      message: 'O arquivo deve ser uma planilha Excel (.xlsx)',
    }),
  }),
  buffer: z.instanceof(Buffer),
})

export async function importCards(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const req_file = await request.file()

    if (!req_file) {
      return reply.status(400).send({ message: 'Nenhum arquivo enviado.' })
    }

    const buffer = await req_file.toBuffer()

    const fileToValidate = {
      buffer,
      ...req_file,
    }

    const file = xlsxFileSchema.parse(fileToValidate)

    const workbook = xlsx.read(file.buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const data = xlsx.utils.sheet_to_json(sheet, {
      defval: '', // Preenche células vazias com string vazia
    })

    let cartoesCadastrados = 0
    let cartoesIgnorados = 0

    data.forEach((row: any, index: number) => {
      // Aqui você pode validar cada linha da planilha
      console.log(`Linha ${index + 1}:`, row)

      try {
        // await knex('cards')
        //   .insert({
        //     id: randomUUID(),
        //     title,
        //     image_url,
        //     card_brand_id: brand_id,
        //     financial_institution_id,
        //     points_currency,
        //     points_conversion_rate,
        //     is_recommended,
        //     annual_fee,
        //     benefits,
        //     vip_lounges,
        //     created_at: new Date(),
        //     updated_at: new Date(),
        //   })
        //   .returning('*')

        cartoesCadastrados++
      } catch (error) {
        console.error(`Erro ao processar linha ${index + 1}:`, error)
        cartoesIgnorados++
      }
    })

    return reply.status(200).send({
      message: 'Planilha recebida e processada!',
      rowCount: data.length,
      cartoesCadastrados,
      cartoesIgnorados,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: 'Erro de validação',
        errors: error.flatten().fieldErrors,
      })
    }

    throw error
  }
}
