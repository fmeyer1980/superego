// const groq = require('groq')
// const client = require('../../utils/sanityClient.js')
// module.exports =  async function() {
//   return await client.fetch(groq`
//   *[_type == "casesPage"]{
//     meta{
//       title,
//       description
//     },
//     title,
//     slug{
//         current
//     },
//     summary,
//     body
//     }[0]
//   `)
// }
