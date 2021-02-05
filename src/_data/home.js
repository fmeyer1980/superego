const groq = require('groq')
const client = require('../../utils/sanityClient.js')
module.exports =  async function() {
  return await client.fetch(groq`
  *[_type == "home"]{
    meta{
      title,
      description
    },
    hero{
      mainImage,
      headline,
      text,
      "video": video.asset->url
    },
    intro,
    featuredCases{
      headline,
      text,
      cases[]->
      { 
        title,
        slug{
          current
        },
        mainImage
      },
    },
    about{
      headline,
      text,
      btnText,
      btnLink
    }
    }[0]
  `)
}
