const API_URL = 'http://localhost:8000'

export const api = {
  async post(endpoint, data) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    return response
  }
}

export default api
