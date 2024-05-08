const express = require('express');
const router = express.Router();

// const { authorization } = require('../middlewares/auth');

const {handleGetFilesByFolder,handleSearchFiles,handleStarredFiles} = require('../controllers/files');


router.post('/', handleGetFilesByFolder)
router.get('/:searchQuery',handleSearchFiles)

router.get('/starred', handleStarredFiles)






module.exports = router;