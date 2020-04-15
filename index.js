/* 
  index.js 
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

  if(!getVariants) {
    return new Response("Fetch variant urls failed")
  } else {
    return getVariants
  }
}


/**
 * Transform variant 
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
        element.setAttribute("href", "https://hunter-college-ossd-spr-2020.github.io/sdhani-weekly/contributions/")
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
  let variantUrls, cookieHeader = {}
  let rawVariantUrls = await getVariants(url)

  if(rawVariantUrls.ok) { 
    variantUrls = await rawVariantUrls.json()
  }
  
  /* Get last URL index displayed to user */
  if(request.headers.get('Cookie')){
    /* Parse cookie header return */
    request.headers.get("Cookie").split(';').forEach(element => {
      let [key,value] = element.split('=')
      cookieHeader[key.trim()] = value
    })
  }

  /* If user hasn't visited the site yet, use A/B Testing style to
     assign user a variant, else assign user previous variant used. */
  let currentIndexUrl = (cookieHeader["previous"]) 
    ? cookieHeader["previous"] 
    : Math.floor(Math.random() * 2)
  
  /* Fetch Variant URL object */
  let currentUrl = await variantUrls.variants[currentIndexUrl]
  let variant = await fetch(currentUrl) 

  if(variant.ok){
    let body = variant.body

    /* Create Response Variant */
    let originalResponse = new Response(body, {
      headers: { 'Set-Cookie': `previous = ${currentIndexUrl}` },
    })
  
    /* Return transformed Response */
    return changeVariant(originalResponse)

  } else { /* Fetch variant url failed */
    return new Response("Fetch Variant operation failed.", {status:500})
  }
}

