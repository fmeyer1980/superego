const BlocksToMarkdown = require('@sanity/block-content-to-markdown')
const groq = require('groq')
const client = require('../../utils/sanityClient.js')
const serializers = require('../../utils/serializers')
const overlayDrafts = require('../../utils/overlayDrafts')
const hasToken = !!client.config().token

function generateCases (cases) {
  return {
    ...cases,
    body: BlocksToMarkdown(cases.body, { serializers, ...client.config() })
  }
}

async function getCases () {
  // Learn more: https://www.sanity.io/docs/data-store/how-queries-work
  const filter = groq`*[ _type == "cases" ]`
  const projection = groq`{
    meta{
      title,
      description
    },
    title,
    slug,
    summary,
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
  const prepareCases = reducedDocs.map(generateCases)
  return prepareCases
}

module.exports = getCases


// const groq = require('groq')
// const client = require('../../utils/sanityClient.js')
// module.exports =  async function() {
//   return await client.fetch(groq`
//   *[_type == "cases"]{
//       title,
//       slug{
//           current
//       },
//       mainImage,
//       body
//     }
//   `)
// }

// const sanityClient = require('@sanity/client')

// const projectId = '0uhyuh19'

// const client = sanityClient({
//   projectId,
//   dataset: 'production',
//   useCdn: true
// })

// module.exports = async function () {
//   const query = `
//     *[ _type == "cases" ]{
//       title,
//       slug { current },
//       mainImage,
//       body
//     }
//   `
//   const params = {}
  
//   return await client.fetch(query, params)
// }