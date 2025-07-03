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

type Row = {
  Nome: string
  Bandeira: string
  'Instituição Financeira': string
  'Taxa de Conversão': number
  'Moeda (BRL/USD)': string
  'Anuidade (Valor/-)': string | number
  'Recomendar (S/N)': string
  Benefícios: string
  'Salas-Vip': string
  'Informações Adicionais': string
  'URL Imagem': string
}

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
    const data = xlsx.utils.sheet_to_json<Row>(sheet, {
      defval: '', // Preenche células vazias com string vazia
    })

    let cartoesCadastrados = 0
    let cartoesIgnorados = 0

    for (const [index, row] of data.entries()) {
      console.log(`Processando linha ${index}:`, row)

      try {
        const title = row.Nome.trim()

        const financialInstitutionName = row['Instituição Financeira'].trim()
        const cardBrandName = row.Bandeira.trim()

        const financialInstitution = await knex('financial_institutions')
          .whereRaw('LOWER(name) = ?', financialInstitutionName.toLowerCase())
          .first()

        if (!financialInstitution) {
          console.error(
            `Linha ${index}: Instituição financeira '${financialInstitutionName}' não encontrada, ignorando.`,
          )
          cartoesIgnorados++
          continue
        }

        const cardBrand = await knex('card_brands')
          .whereRaw('LOWER(name) = ?', cardBrandName.toLowerCase())
          .first()

        if (!cardBrand) {
          console.error(
            `Linha ${index}: Bandeira '${cardBrandName}' não encontrada, ignorando.`,
          )
          cartoesIgnorados++
          continue
        }

        const points_conversion_rate = Number(row['Taxa de Conversão']) || 0
        const points_currency =
          (row['Moeda (BRL/USD)'] || '').trim().toUpperCase() === 'USD'
            ? 'USD'
            : 'BRL'

        const annual_fee_raw = String(row['Anuidade (Valor/-)'] || '').trim()
        const annual_fee =
          annual_fee_raw === '-' || annual_fee_raw === ''
            ? 0
            : parseFloat(annual_fee_raw)

        const is_recommended =
          (row['Recomendar (S/N)'] || '').trim().toUpperCase() === 'S'

        const benefits = row['Benefícios']?.trim() || ''
        const vip_lounges = row['Salas-Vip']?.trim() || ''
        const additional_info = row['Informações Adicionais']?.trim() || ''
        const image_url = row['URL Imagem']?.trim() || ''

        await knex('cards').insert({
          id: randomUUID(),
          title,
          financial_institution_id: financialInstitution.id,
          card_brand_id: cardBrand.id,
          points_conversion_rate,
          points_currency,
          is_recommended,
          annual_fee,
          benefits,
          vip_lounges,
          additional_info,
          image_url,
          created_at: new Date(),
          updated_at: new Date(),
        })

        console.log(`Linha ${index}: Cartão '${title}' cadastrado com sucesso.`)
        cartoesCadastrados++
      } catch (error) {
        console.error(`Erro ao processar linha ${index}:`, error)
        cartoesIgnorados++
      }
    }

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
