import express from 'express';
import { v4 as uuid } from 'uuid';

const app = express();
app.use(express.json());

const templates: any[] = [];

app.post('/', (req, res) => {
  const template = { id: uuid(), ...req.body };
  templates.push(template);
  res.status(201).json(template);
});

app.get('/', (_req, res) => {
  res.json(templates);
});

app.get('/:id', (req, res) => {
  const template = templates.find(t => t.id === req.params.id);
  if (!template) return res.status(404).end();
  res.json(template);
});

app.put('/:id', (req, res) => {
  const index = templates.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).end();
  templates[index] = { ...templates[index], ...req.body };
  res.json(templates[index]);
});

app.delete('/:id', (req, res) => {
  const index = templates.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).end();
  templates.splice(index, 1);
  res.status(204).end();
});

const port = process.env.PORT || 3004;
app.listen(port, () => console.log(`Template service running on ${port}`));

export default app;
