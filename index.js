const { IncomingForm } = require('formidable')

const parseData = request => {
  return new Promise((resolve, reject) => {
    const data = {}
    new IncomingForm().parse(request)
      .on('fileBegin', (name, file) => uploadFile(file))
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
  file.path = __dirname + "/uploads/" + file.name
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
