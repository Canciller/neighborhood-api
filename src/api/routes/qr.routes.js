const { Router } = require('express');
const router = Router();
const QRService = require('../../services/qr.service');
const VisitService = require('../../services/visit.service');
const isAllow = require('../middlewares/isAllow');
const createError = require('http-errors');

// TODO: Get user ID from req.auth.id

const QRNotFoundError = createError(404, 'QR no encontrado.');

const isAllowQR = isAllow('qr'),
  isAllowQRMatch = isAllow('qr/match');

module.exports = (app) => {
  app.use('/qr', router);

  /**
   * Get all QR.
   */
  router.get('/', isAllowQR, async (req, res, next) => {
    const query = {
      skip: req.query.skip,
      limit: req.query.limit,
      enabled: req.query.enabled,
    };

    try {
      const qr = await QRService.list(query);

      if (qr) res.json(qr);
      else throw createError(500, 'Ha ocurrio un error al traer los QR.');
    } catch (err) {
      next(err);
    }
  });

  router
    .route('/:user')
    .all(isAllowQR)
    /**
     * Get QR.
     */
    .get(async (req, res, next) => {
      try {
        const qr = await QRService.get(req.params.user);

        if (qr) res.json(qr);
        else throw QRNotFoundError;
      } catch (err) {
        next(err);
      }
    })

    /**
     * Generate QR (Update or create).
     */
    .post(async (req, res, next) => {
      try {
        const qr = await QRService.generate(req.params.user);

        if (qr) res.json(qr);
        else throw new Error('Ha ocurrio un problema al generar el QR.');
      } catch (err) {
        next(err);
      }
    })

    /**
     * Delete QR.
     */
    .delete(async (req, res, next) => {
      try {
        const qr = await QRService.delete(req.params.user);

        if (qr) res.json(qr);
        else throw QRNotFoundError;
      } catch (err) {
        next(err);
      }
    });

  /**
   * Enable QR.
   */
  router.put('/enable/:user', isAllowQR, async (req, res, next) => {
    try {
      const qr = await QRService.enable(req.params.user);

      if (qr) res.json(qr);
      else throw QRNotFoundError;
    } catch (err) {
      next(err);
    }
  });

  /**
   * Disable QR.
   */
  router.put('/disable/:user', isAllowQR, async (req, res, next) => {
    try {
      const qr = await QRService.disable(req.params.user);

      if (qr) res.json(qr);
      else throw QRNotFoundError;
    } catch (err) {
      next(err);
    }
  });

  /**
   * Match QR.
   */
  router.get('/match/:user/:code', isAllowQRMatch, async (req, res, next) => {
    try {
      const qr = await QRService.get(req.params.user);

      // TODO: Create service method for this.
      if (qr && qr.isCodeCorrect(req.params.code)) {
        await VisitService.create(qr.user.id);
        res.json(qr);
      } else
        throw createError(
          401,
          'Codigos de seguridad no coinciden o QR esta deshabilitado.'
        );
    } catch (err) {
      next(err);
    }
  });
};
