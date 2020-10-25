const { Router } = require('express');
const router = Router();
const VisitService = require('../../services/visit.service');

module.exports = (app) => {
  app.use('/visits', router);

  router.get('', async (req, res, next) => {
    try {
      const visit = await VisitService.getAllVisits();
      if (!visit) throw createError(404, 'Visita no encontrada.');
      else res.json(visit);
    } catch (error) {
      next(error);
    }
  });

  router.post('', async (req, res, next) => {
    try {
      const visit = await VisitService.create(req.body);
      if (!visit)
        throw createError(401, 'Ha ocurrido un problema al crear la visita.');
      else res.json(visit);
    } catch (error) {
      next(error);
    }
  });

  router.get('/:username', async (req, res, next) => {
    try {
      const visit = await VisitService.get(req.params.username);
      if (!visit) throw createError(404, 'Visita no encontrada.');
      else res.json(visit);
    } catch (error) {
      next(error);
    }
  });

  router.get('/visit/:id', async (req, res, next) => {
    try {
      const visit = await VisitService.getById(req.params.id);
      if (!visit) throw createError(404, 'Visita no encontrada.');
      else res.json(visit);
    } catch (error) {
      next(error);
    }
  });

  router.put('/:id', async (req, res, next) => {
    try {
      const visit = await VisitService.updateVisit(req.params.id);
      if (!visit) throw createError(404, 'Visita no encontrada.');
      else res.json(visit);
    } catch (error) {
      next(error);
    }
  });
};
