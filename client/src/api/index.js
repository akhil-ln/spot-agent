import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export async function analyseRequest(spotRequest, rawQuotes) {
  const { data } = await api.post('/analyse', {
    spot_request: spotRequest,
    raw_quotes: rawQuotes,
  })
  return data
}

export async function healthCheck() {
  const { data } = await api.get('/health')
  return data
}