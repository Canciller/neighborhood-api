const { Router } = require('express');
const router = Router();
const isAllow = require('../middlewares/isAllow');
const VisitService = require('../../services/visit.service');
const createError = require('http-errors');

// TODO: Get user ID from req.auth.id

module.exports = (app) => {
  app.use('/visits', router);

  /**
   * Get all visits of user.
   */
  router.get('/:user', isAllow('visit'), async (req, res, next) => {
    try {
      return res.json(await VisitService.get(req.params.user, req.query));
    } catch (err) {
      next(err);
    }
  });

  /**
   * Delete visit of user.
   */
  router.delete('/:user/:id', isAllow('visit'), async (req, res, next) => {
    try {
      const visit = await VisitService.delete(req.params.user, req.params.id);
      if (visit) return res.json(visit);
      else throw new createError(404, 'Visita no encontrada.');
    } catch (err) {
      next(err);
    }
  });

  /**
   * Delete all visits of user.
   */
  router.delete('/:user', isAllow('visit'), async (req, res, next) => {
    try {
      const user = await VisitService.deleteAll(req.params.user);
      if (user) return res.json(user);
      else throw new createError(404, 'Usuario no encontrado.');
    } catch (err) {
      next(err);
    }
  });
};
