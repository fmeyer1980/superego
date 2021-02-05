const BlocksToMarkdown = require('@sanity/block-content-to-markdown')
const groq = require('groq')
const client = require('../../utils/sanityClient.js')
const serializers = require('../../utils/serializers')
const overlayDrafts = require('../../utils/overlayDrafts')
const hasToken = !!client.config().token

function generateEmployers (employers) {
  return {
    ...employers,
    excerpt: BlocksToMarkdown(employers.excerpt, { serializers, ...client.config() }),
    body: BlocksToMarkdown(employers.body, { serializers, ...client.config() })
  }
}

async function getEmployers () {
  // Learn more: https://www.sanity.io/docs/data-store/how-queries-work
  const filter = groq`*[_type == "employers"]`
  const projection = groq`{
    name,
    mainImage
  }`
  const order = `| order(publishedAt asc)`
  const query = [filter, projection, order].join(' ')
  const docs = await client.fetch(query).catch(err => console.error(err))
  const reducedDocs = overlayDrafts(hasToken, docs)
  const prepareEmployers = reducedDocs.map(generateEmployers)
  return prepareEmployers
}

module.exports = getEmployers