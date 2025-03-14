import express from 'express';
import Router from 'express-promise-router';
import { PersistenceContext } from './services/NewsService/persistence/persistenceContext';

export async function createRouter({
  persistenceContext,
}: {
  persistenceContext: PersistenceContext;
}): Promise<express.Router> {
  const router = Router();
  router.use(express.json());

  router.get('/', async (_req, res) => {
    res.json(await persistenceContext.newsDb.allNews());
  });

  router.get('/:id', async (req, res) => {
    res.json(await persistenceContext.newsDb.newsById(req.params.id));
  });

  return router;
}
