const API_BASE = 'http://localhost:8888/api/products';

async function getProductById(id) {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error(`Product ${id} not found`);
  return res.json();
}

async function getVariants(productId, page = 0, size = 50) {
  const res = await fetch(`${API_BASE}/${productId}/variants?page=${page}&size=${size}`);
  if (!res.ok) throw new Error('Variants not found');
  const data = await res.json();
  // return array (handle Page or array)
  return Array.isArray(data) ? data : (data.content || []);
}

async function getRelatedByCategory(categoryId, size = 8) {
  const res = await fetch(`${API_BASE}/category/${categoryId}?page=0&size=${size}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.content || data;
}

async function getFeatured(size = 8) {
  const res = await fetch(`${API_BASE}/featured?page=0&size=${size}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.content || data;
}

export default {
  getProductById,
  getVariants,
  getRelatedByCategory,
  getFeatured
};