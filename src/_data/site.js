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
    footer{
      colTwoTitle,
      colThreeTitle,
      images
    },

    "contact": *[_type == "contactPage"]{
      title,
      slug{
        current
      }
    }[0],

    "services": *[_type == "pages" && _id == "dec570bc-e7b4-48f1-9137-95f01933c57c"]{
      title,
      slug
    }[0],

    }[0]


  `)
}
