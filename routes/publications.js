const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const publicationsCtrl = require('../controllers/publications')
const multer = require('../middleware/multer-config')
/*Création de publication*/
router.post('/',auth ,multer ,publicationsCtrl.createPublication)
/*Modification de publication*/
router.put('/:id',auth ,multer ,publicationsCtrl.updatePublication)
/*Suppression de publication*/
router.delete('/:id',auth ,publicationsCtrl.deletePublication)
/*Obtention de toutes les publications*/
router.get('/',auth ,publicationsCtrl.getAllPublications)
/*Obtenir plus de publications*/
router.get('/:numberOfPublications',auth ,publicationsCtrl.getMorePublications)
/*Like et dislike des publications*/
router.post('/:id/like',auth ,publicationsCtrl.like)
router.get('/:id/like',auth ,publicationsCtrl.getLikes)
router.get('/:id/dislike',auth ,publicationsCtrl.getDislikes)
router.get('/:id/like/:userId',auth ,publicationsCtrl.noteLike)
router.get('/:id/dislike/:userId',auth ,publicationsCtrl.noteDislike)
module.exports = router