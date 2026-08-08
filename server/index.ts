import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import fs from 'fs';

// Load environment variables dynamically based on what exists
const envLocalPath = path.resolve(__dirname, '../.env.local');
const envPath = path.resolve(__dirname, '../.env');

if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else {
  dotenv.config({ path: envPath });
}

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not found in the environment.');
}

const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder');

const normalizeProductPayload = (body: Record<string, any>) => {
  const { options, ...payload } = body;
  if (Array.isArray(options)) {
    payload.variations = options;
    payload.portions = [];
  }
  return payload;
};

// --- Authentication Routes ---
app.get('/api/auth/user-exists', async (req, res) => {
  const email = typeof req.query.email === 'string' ? req.query.email.trim().toLowerCase() : '';
  res.set('Cache-Control', 'private, no-store');

  if (!email) return res.status(400).json({ error: 'Email is required' });

  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .limit(1);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ exists: Array.isArray(data) && data.length > 0 });
});

// --- Products Routes ---
app.get('/api/products', async (req, res) => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/products', async (req, res) => {
  const { data, error } = await supabase.from('products').insert([normalizeProductPayload(req.body)]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

app.put('/api/products/:id', async (req, res) => {
  const { data, error } = await supabase.from('products').update(normalizeProductPayload(req.body)).eq('id', req.params.id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

app.delete('/api/products/:id', async (req, res) => {
  const { error } = await supabase.from('products').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

// --- Orders Routes ---
app.get('/api/orders', async (req, res) => {
  const { data, error } = await supabase.from('orders').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/orders', async (req, res) => {
  const { data, error } = await supabase.from('orders').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

app.put('/api/orders/:id', async (req, res) => {
  const { data, error } = await supabase.from('orders').update(req.body).eq('id', req.params.id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

app.get('/api/users/:id/orders', async (req, res) => {
  res.set('Cache-Control', 'private, no-store');
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', req.params.id)
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// --- Categories Routes ---
app.get('/api/categories', async (req, res) => {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/categories', async (req, res) => {
  const { data, error } = await supabase.from('categories').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

app.delete('/api/categories/:name', async (req, res) => {
  const { error } = await supabase.from('categories').delete().eq('name', req.params.name);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

// --- Users Routes ---
app.get('/api/users', async (req, res) => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  res.set('Cache-Control', 'private, no-store');
  const profileResult = await supabase.from('users').select('*').eq('id', userId).single();

  if (profileResult.error?.code === 'PGRST116') return res.status(404).json({ error: 'User not found' });
  if (profileResult.error) return res.status(500).json({ error: profileResult.error.message });

  const ordersResult = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', profileResult.data.id)
    .order('created_at', { ascending: false });

  if (ordersResult.error) return res.status(500).json({ error: ordersResult.error.message });
  const orders = Array.isArray(ordersResult.data)
    ? ordersResult.data
    : ordersResult.data
      ? [ordersResult.data]
      : [];
  res.json({ ...profileResult.data, orders });
});

app.post('/api/users', async (req, res) => {
  const { data, error } = await supabase.from('users').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

app.put('/api/users/:id', async (req, res) => {
  const { data, error } = await supabase.from('users').update(req.body).eq('id', req.params.id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// --- Impact Projects Routes ---
app.get('/api/impact/projects', async (req, res) => {
  const { data, error } = await supabase.from('impact_projects').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/impact/projects', async (req, res) => {
  const { data, error } = await supabase.from('impact_projects').insert([{ ...req.body, tag: '' }]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

app.put('/api/impact/projects/:id', async (req, res) => {
  const { data, error } = await supabase.from('impact_projects').update(req.body).eq('id', req.params.id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

app.delete('/api/impact/projects/:id', async (req, res) => {
  const { error } = await supabase.from('impact_projects').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

// --- Donation Projects Routes ---
app.get('/api/donation/projects', async (_req, res) => {
  const { data, error } = await supabase.from('donation_projects').select('*').order('date', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/donation/projects', async (req, res) => {
  const { data, error } = await supabase.from('donation_projects').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

app.put('/api/donation/projects/:id', async (req, res) => {
  const { data, error } = await supabase.from('donation_projects').update(req.body).eq('id', req.params.id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

app.delete('/api/donation/projects/:id', async (req, res) => {
  const { error } = await supabase.from('donation_projects').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

// --- Impact Stats Routes ---
app.get('/api/impact/stats', async (req, res) => {
  const { data, error } = await supabase.from('fund_stats').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/impact/stats', async (req, res) => {
  const { data, error } = await supabase.from('fund_stats').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

app.put('/api/impact/stats/:id', async (req, res) => {
  const { data, error } = await supabase.from('fund_stats').update(req.body).eq('id', req.params.id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

app.delete('/api/impact/stats/:id', async (req, res) => {
  const { error } = await supabase.from('fund_stats').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

// --- Impact Metrics Routes ---
app.get('/api/impact/metrics', async (req, res) => {
  const { data, error } = await supabase.from('impact_metrics').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put('/api/impact/metrics/:key', async (req, res) => {
  const { data, error } = await supabase.from('impact_metrics').update({ value: req.body.value }).eq('key', req.params.key).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// --- Admin Config Routes ---
app.get('/api/admin/config', async (req, res) => {
  const { data, error } = await supabase.from('admin_config').select('*').eq('id', 1).single();
  // Return default if no backend config found early on
  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
});

app.put('/api/admin/config', async (req, res) => {
  const { username, password } = req.body;
  const { data, error } = await supabase.from('admin_config').upsert({ id: 1, username, password }).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// --- Payment Config Routes ---
app.get('/api/payment/config', async (req, res) => {
  const { data, error } = await supabase.from('payment_config').select('*').eq('id', 1).single();
  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
});

app.put('/api/payment/config', async (req, res) => {
  const { qr_image, bank_info } = req.body;
  const { data, error } = await supabase.from('payment_config').upsert({ id: 1, qr_image, bank_info }).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// --- Impact Page Config Routes ---
app.get('/api/impact/page_config', async (req, res) => {
  const { data, error } = await supabase.from('impact_page_config').select('*').eq('id', 1).single();
  if (error || !data) {
    return res.json({
      id: 1,
      hero_title: 'Placeholder',
      hero_description: 'Placeholder',
      showcase_title: 'Placeholder',
      showcase_image: ''
    });
  }
  res.json(data);
});

app.put('/api/impact/page_config', async (req, res) => {
  const payload = { id: 1, ...req.body };
  const { data, error } = await supabase.from('impact_page_config').upsert(payload).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// --- Donation Page Config Routes ---
const defaultDonationPageConfig = {
  id: 1,
  title: 'Placeholder',
  subtitle: 'Placeholder',
  bottom_title: 'Placeholder',
  tzuchi_link_text: 'Placeholder',
  tzuchi_link_url: 'https://www.tzuchi.org.tw/en/',
  qr_image: '',
  qr_caption: 'Placeholder'
};

app.get('/api/donation/page_config', async (_req, res) => {
  const { data, error } = await supabase.from('donation_page_config').select('*').eq('id', 1).single();
  if (error || !data) return res.json(defaultDonationPageConfig);
  res.json(data);
});

app.put('/api/donation/page_config', async (req, res) => {
  const payload = { id: 1, ...req.body };
  const { data, error } = await supabase.from('donation_page_config').upsert(payload).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// --- Market Page Config Routes ---
const defaultMarketHeroImage = 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&q=80&w=2000';
const legacyMarketCarouselPrefix = 'altitude-ally-carousel:';

const decodeLegacyMarketCarousel = (value: unknown) => {
  if (typeof value !== 'string' || !value.startsWith(legacyMarketCarouselPrefix)) return null;
  try {
    const decoded = JSON.parse(value.slice(legacyMarketCarouselPrefix.length));
    return decoded && typeof decoded === 'object' ? decoded : null;
  } catch {
    return null;
  }
};

const normalizeMarketPageConfig = (config: Record<string, any> = {}) => {
  const encodedConfig = decodeLegacyMarketCarousel(config.hero_image_url)
    || decodeLegacyMarketCarousel(Array.isArray(config.hero_images) ? config.hero_images[0] : null);
  const storedImages = encodedConfig?.hero_images || config.hero_images;
  const configuredImages = Array.isArray(storedImages)
    ? storedImages.filter((image: unknown): image is string => typeof image === 'string' && image.trim().length > 0 && !image.startsWith(legacyMarketCarouselPrefix))
    : [];
  const legacyImage = !encodedConfig && typeof config.hero_image_url === 'string' && config.hero_image_url.trim()
    ? config.hero_image_url.trim()
    : defaultMarketHeroImage;
  const heroImages = configuredImages.length > 0 ? configuredImages : [legacyImage];

  return {
    ...config,
    id: 1,
    hero_image_url: heroImages[0],
    hero_images: heroImages,
    hero_interval_seconds: Math.min(60, Math.max(2, Number(encodedConfig?.hero_interval_seconds ?? config.hero_interval_seconds) || 5))
  };
};

app.get('/api/market/page_config', async (_req, res) => {
  const { data, error } = await supabase.from('market_page_config').select('*').eq('id', 1).single();
  if (error || !data) {
    return res.json(normalizeMarketPageConfig());
  }
  res.json(normalizeMarketPageConfig(data));
});

app.put('/api/market/page_config', async (req, res) => {
  const payload = normalizeMarketPageConfig(req.body);
  const { data, error } = await supabase.from('market_page_config').upsert(payload).select();
  if (error) {
    const legacyPayload = {
      id: 1,
      hero_image_url: `${legacyMarketCarouselPrefix}${JSON.stringify({
        hero_images: payload.hero_images,
        hero_interval_seconds: payload.hero_interval_seconds
      })}`
    };
    const { data: legacyData, error: legacyError } = await supabase.from('market_page_config').upsert(legacyPayload).select();
    if (legacyError) return res.status(500).json({ error: legacyError.message });
    return res.json(normalizeMarketPageConfig(legacyData[0]));
  }
  res.json(normalizeMarketPageConfig(data[0]));
});

// --- Footer Page Config Routes ---
const defaultFooterPageConfig = {
  id: 1,
  mission_text: 'Our mission content will be added here.',
  privacy_text: 'Our privacy policy will be added here.',
  terms_text: 'Our terms and conditions will be added here.',
  instagram: 'Instagram details coming soon.',
  email: 'Email details coming soon.',
  line: 'LINE details coming soon.',
  facebook: 'Facebook details coming soon.'
};

app.get('/api/footer/page_config', async (_req, res) => {
  const { data, error } = await supabase.from('footer_page_config').select('*').eq('id', 1).single();
  if (error || !data) return res.json(defaultFooterPageConfig);
  res.json(data);
});

app.put('/api/footer/page_config', async (req, res) => {
  const payload = { id: 1, ...req.body };
  const { data, error } = await supabase.from('footer_page_config').upsert(payload).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
  });
}

export default app;
