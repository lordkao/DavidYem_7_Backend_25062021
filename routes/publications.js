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
router.post('/:id/likes',auth ,publicationsCtrl.postLike)/*ok*/
router.post('/:id/dislikes',auth ,publicationsCtrl.postDislike)/*ok*/
router.get('/:id/likes',auth ,publicationsCtrl.getLikes)/*ok*/
router.get('/:id/dislikes',auth ,publicationsCtrl.getDislikes)/*ok*/
router.get('/:id/likes/:userId', auth ,publicationsCtrl.getOneLike)
module.exports = router