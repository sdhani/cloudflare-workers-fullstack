addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})


/**
 * Respond to Fetch request
 * @param {Request} request
 */
async function handleRequest(request) {
  const url = 'https://cfw-takehome.developers.workers.dev/api/variants'
  
  let urls, response = await fetch(url)

  if(response.ok) {
    urls = await response.json()
    console.log(urls.variants[0], urls.variants[1])
  }

  let prevUrl = 1
  let displayThisUrl = urls.variants[prevUrl]
  let urlResponse = await fetch(displayThisUrl)

  return new Response(urlResponse.body);
}
