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
  let currentUrl = variantUrls.variants[currentIndexUrl]

  /* Fetch Variant URL object */
  let variant = await fetch(currentUrl)
  let body = variant.body;

  /* A/B Testing style, Switch between control and test variants */
  currentIndexUrl = (currentIndexUrl == 0) ? 1 : 0

  return new Response(body, {
    headers: { 'Set-Cookie': previous = currentIndexUrl },
  });
}
