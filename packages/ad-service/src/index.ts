import express from 'express';
import { v4 as uuid } from 'uuid';

const app = express();
app.use(express.json());

const ads: any[] = [];

app.post('/', (req, res) => {
  const ad = { id: uuid(), ...req.body };
  ads.push(ad);
  res.status(201).json(ad);
});

app.get('/', (_req, res) => {
  res.json(ads);
});

app.get('/:id', (req, res) => {
  const ad = ads.find(a => a.id === req.params.id);
  if (!ad) return res.status(404).end();
  res.json(ad);
});

app.put('/:id', (req, res) => {
  const index = ads.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).end();
  ads[index] = { ...ads[index], ...req.body };
  res.json(ads[index]);
});

app.delete('/:id', (req, res) => {
  const index = ads.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).end();
  ads.splice(index, 1);
  res.status(204).end();
});

const port = process.env.PORT || 3003;
app.listen(port, () => console.log(`Ad service running on ${port}`));

export default app;
