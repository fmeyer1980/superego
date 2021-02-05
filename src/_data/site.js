const groq = require('groq')
const client = require('../../utils/sanityClient.js')
module.exports =  async function() {
  return await client.fetch(groq`
  *[_type == "siteSettings"]{
      name,
      address,
      zip,
      cvr,
      phone,
      mail,
    preFoot{
      title,
      text,
      linkText
    },
    }[0]
  `)
}
