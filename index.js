require('dotenv').config()
const { IncomingForm } = require('formidable')

const uploadPath = process.env.UPLOAD_PATH ?? 'uploads'

const getUploadPath = () => {
  if (uploadPath.indexOf('/') === 0)
    uploadPath.slice(0, 1)
  if (uploadPath.indexOf('/') === uploadPath.length - 1)
    uploadPath.slice(uploadPath.length - 1, 1)

  return `${process.cwd()}/${uploadPath}/`
}

const parseData = request => {
  return new Promise((resolve, reject) => {
    const data = {}
    new IncomingForm().parse(request)
      .on('fileBegin', (name, file) => {
        uploadFile(file)
        data[name] = file.path.split(`${process.cwd()}/`).pop()
      })
      .on('field', (name, value) => data[name] = value)
      .on('end', () => resolve(data))
      .on('error', error => reject(error))
  })
}

const uploadFile = file => {
  const fileNameSections = file.name.split('.')
  const fileExt = fileNameSections.pop()
  const randomStr = Math.random().toString(36).substr(2, 8)

  file.name = `${randomStr}.${fileExt}`
  file.path = `${getUploadPath()}${file.name}`
}

module.exports = async (req, res, next) => {
  if (req.is('multipart/form-data')) {
    try {
      req.body = await parseData(req)
    } catch (error) {
      console.error(error)
    }
  }

  next()
}
