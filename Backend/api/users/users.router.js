const router = require('express').Router()
const Upload = require('../../middleware/UploadImage')
const { userUploadFiles } = require('./users.controller')

const mediaUplaod = Upload.fields([
    {name: "profileImage", maxCount: 1 },
    {name:"video",maxCount: 1}
])

router.post()

router.patch('/:_id', mediaUplaod, userUploadFiles)
