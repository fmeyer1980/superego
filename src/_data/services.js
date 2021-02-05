const BlocksToMarkdown = require('@sanity/block-content-to-markdown')
const groq = require('groq')
const client = require('../../utils/sanityClient.js')
const serializers = require('../../utils/serializers')
const overlayDrafts = require('../../utils/overlayDrafts')
const hasToken = !!client.config().token

function generateServices (services) {
  return {
    ...services,
    excerpt: BlocksToMarkdown(services.excerpt, { serializers, ...client.config() }),
    body: BlocksToMarkdown(services.body, { serializers, ...client.config() })
  }
}

async function getServices () {
  // Learn more: https://www.sanity.io/docs/data-store/how-queries-work
  const filter = groq`*[_type == "services" && defined(slug)]`
  const projection = groq`{
    title,
    slug,
    mainImage,
    body[]{
      ...,
      children[]{
        ...,
      }
    },
  }`
  const order = `| order(publishedAt asc)`
  const query = [filter, projection, order].join(' ')
  const docs = await client.fetch(query).catch(err => console.error(err))
  const reducedDocs = overlayDrafts(hasToken, docs)
  const prepareServices = reducedDocs.map(generateServices)
  return prepareServices
}

module.exports = getServices