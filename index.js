addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})


/**
 * Respond to Fetch request
 * @param {Request} request
 */
async function handleRequest(request) {
  return new Response("Response of Handle Request", {
    headers: { 'content-type': 'text/plain' },
  });
}
