const router = require('express').Router();
const passport = require('../../passport');
const adminRentalsController = require('../../controllers/adminRentalsController');

// Matches with '/admin/rentals'
router.route('/')
  .get(isAdmin, adminRentalsController.findAll)
  .post(isAdmin, adminRentalsController.create);

// Matches with '/admin/rentals/:id'
router
  .route('/:id')
  .get(isAdmin, adminRentalsController.findById)
  .put(isAdmin, adminRentalsController.update)
  .delete(isAdmin, adminRentalsController.remove);
  
  function isAdmin(req, res, next) {
    if (req.user.admin)
      return next();
    res.json({ isAuthenticated: false });
  }

module.exports = router;