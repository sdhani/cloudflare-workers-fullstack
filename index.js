/* 
  ./index.js 
  Author: Shania Dhani
  Last Modified: April 15th 2020 
*/

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Fetch Variant URLs 
 *  @param url
 *  @returns
 */
async function getVariants(url){
  let getVariants = await fetch(url)

  if(getVariants.ok) { 
    return await getVariants.json() 
  } else { 
    return new Error("Fetch Variant URLs failed") 
  }
}


/**
 * Transform Variant oldVariant. Return new Variant 
 *  @param oldVariant  
 *  @returns newVariant
 */
async function changeVariant(oldVariant) {
  let newVariant = new HTMLRewriter()
    .on('h1#title', {
      element(element) {
        element.setInnerContent(`The Awesomer Variant`)
      },
    })
    .on('title', {
      element(element) {
        element.setInnerContent(`Where Awesome People Thrive.`)
      }
    })
    .on('p#description', {
      element(element) {
        element.setInnerContent(`Starting out in Open Source. (Tiny but looking to grow)`)
      }
    })
    .on('a', {
      element(element) {
        element.setAttribute("href", "https://hunter-college-ossd-spr-2020.github.io/sdhani-weekly/contributions/");
        element.setInnerContent(`Open Source Contributions`)
      }
    })
    .transform(oldVariant)
  
  return newVariant
}


/**
 * Respond with variant URL in A/B Testing Style
 * @param {Request} request
 * @returns {Response} variant
 */
async function handleRequest(request) {
  const url = 'https://cfw-takehome.developers.workers.dev/api/variants'
  let variantUrls = await getVariants(url)

  /* Get last URL index displayed to user */
  let currentIndexUrl = request.headers.get('Cookie')
  
  /* If user hasn't visited the site yet, use A/B Testing style 
     to assign user a variant, else assign user persisted variant
  */
  if(currentIndexUrl === null){
    currentIndexUrl = Math.floor(Math.random() * 2)
  } 

  /* Fetch Variant URL object */
  let currentUrl = variantUrls.variants[currentIndexUrl]
  let variant = await fetch(currentUrl) 
  let body = variant.body;

  /* Create Response Variant */
  let response = new Response(body, {
    headers: { 'Set-Cookie': previous = currentIndexUrl },
  });

  /* Return transformed Response */
  return changeVariant(response) 
}

