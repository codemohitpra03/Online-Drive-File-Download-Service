const express = require('express');
const router = express.Router();

// const { authorization } = require('../middlewares/auth');

const {handleCreateFile,handleDeleteFile,handleUpdateStarredFile} = require('../controllers/file');

router.post('/', handleCreateFile)
router.delete('/:fileId',handleDeleteFile)

router.put('/starred', authorization, handleUpdateStarredFile)






module.exports = router;