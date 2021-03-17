require('dotenv').config()
const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
 
const s3 = new aws.S3()

aws.config.update({
    secretAccessKey: process.env.SECRET_ACCESS_KEY, 
    accessKeyId: process.env.ACCESS_KEY_ID, 
    origin: process.env.ORIGIN
})

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'reseau-social',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})

module.exports = upload;
