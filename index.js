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
 * Respond with variant URL in A/B Testing Style
 * @param {Request} request
 * @returns {Response} variant
 */
async function handleRequest(request) {
  const url = 'https://cfw-takehome.developers.workers.dev/api/variants'
  let variantUrls = await getVariants(url)

  /* Get last URL index displayed to user */
  let currentIndexUrl = request.headers.get('Cookie')
  
  /* If user hasn't visited the site yet,
     use A/B Testing style to assign user
     a variant else assign user persisted variant
  */
  if(currentIndexUrl === null){
    currentIndexUrl = Math.floor(Math.random() * 2)
    console.log("NEW VARIANT", currentIndexUrl)
  } 

  let currentUrl = variantUrls.variants[currentIndexUrl]
  let variant = await fetch(currentUrl) /* Fetch Variant URL object */
  let body = variant.body;

  return new Response(body, {
    headers: { 'Set-Cookie': previous = currentIndexUrl },
  });
}

