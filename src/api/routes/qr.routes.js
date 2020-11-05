const { Router } = require('express');
const router = Router();
const QRService = require('../../services/qr.service');

module.exports = (app) => {
  app.use('/qrs', router);

  router.get('', async (req, res, next) => {
    try {
      const qr = await QRService.getAll();
      if (!qr) throw createError(404, 'QR no encontrados.');
      else res.json(qr);
    } catch (error) {
      next(error);
    }
  });

  router.get('/actives', async (req, res, next) => {
    try {
      const qr = await QRService.getAllActiveQR();
      if (!qr) throw createError(404, 'QR no encontrados.');
      else res.json(qr);
    } catch (error) {
      next(error);
    }
  });

  router.post('', async (req, res, next) => {
    try {
      const qr = await QRService.create(req.body);
      if (!qr)
        throw createError(401, 'Ha ocurrido un problema al crear el qr.');
      else res.json(qr);
    } catch (error) {
      next(error);
    }
  });

  /*
  router.get('/:username', async (req, res, next) => {
    try {
      const qr = await QRService.get(req.params.username);
      if (!qr) throw createError(404, 'QR no encontrado.');
      else res.json(qr);
    } catch (error) {
      next(error);
    }
  });*/

  router.get('/user/:userID', async (req, res, next) => {
    try {
      const qr = await QRService.getByUserID(req.params.userID);
      if (!qr) throw createError(404, 'QR no encontrado.');
      else {
        //res.json(qr);
        if(qr.isActive) res.send(`<h2>Puede pasar</h2>`);
        else res.send(`<h2>No puede pasar</h2>`);
      }
    } catch (error) {
      next(error);
    }
  });


  router.get('/qr/:userID', async (req, res, next) => {
    try {
      const qr = await QRService.generate(req.params.userID);
      if (!qr) throw createError(404, 'QR no encontrado.');
      else res.json(qr);
    } catch (error) {
      next(error);
    }
  });

  router.put('/block/:id', async (req, res, next) => {
    try {
      const qr = await QRService.blockQR(req.params.id);
      if (!qr)
        throw createError(401, 'Ha ocurrido un problema al bloquear el qr.');
      else res.json(qr);
    } catch (error) {
      next(error);
    }
  });

  router.put('/unblock/:id', async (req, res, next) => {
    try {
      const qr = await QRService.unblockQR(req.params.id);
      if (!qr)
        throw createError(401, 'Ha ocurrido un problema al bloquear el qr.');
      else res.json(qr);
    } catch (error) {
      next(error);
    }
  });

  router.put('/regenerate', async (req, res, next) => {
    try {
      const qr = await QRService.regenerateQR(req.body.id);
      if (!qr)
        throw createError(401, 'Ha ocurrido un problema al regenerar el qr.');
      else res.json(qr);
    } catch (error) {
      next(error);
    }
  });
};
