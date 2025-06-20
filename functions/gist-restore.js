export async function onRequest(context) {
  const { request, env } = context;
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response('Bad Request', { status: 400 });
  }
  const { username, password } = body;
  if (username !== env.MY_USER || password !== env.MY_PASS) {
    return new Response('Unauthorized', { status: 401 });
  }
  const pat = env.GIST_PAT;
  const gistsRes = await fetch('https://api.github.com/gists', {
    headers: { Authorization: 'token ' + pat }
  });
  const gists = await gistsRes.json();
  const gist = gists.find(g => g.files && g.files['totp_tokens.json']);
  if (!gist) return new Response('Not found', { status: 404 });
  const gistDetailRes = await fetch('https://api.github.com/gists/' + gist.id, {
    headers: { Authorization: 'token ' + pat }
  });
  const gistDetail = await gistDetailRes.json();
  const fileContent = gistDetail.files['totp_tokens.json'];
  if (!fileContent || !fileContent.content) return new Response('No content', { status: 404 });
  return new Response(fileContent.content, { headers: { 'Content-Type': 'application/json' } });
}
