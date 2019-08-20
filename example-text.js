const path = require("path")
const pdf_extract = require('./main.js')

console.log("Usage: node thisfile.js the/path/tothe.pdf")
const absolute_path_to_pdf = path.resolve(process.argv[2])
if (absolute_path_to_pdf.includes(" ")) throw new Error("will fail for paths w spaces like "+absolute_path_to_pdf)

const options = {
  type: 'text', // extract searchable text from PDF
  ocr_flags: ['--psm 1'] // automatically detect page orientation
}
const processor = pdf_extract(absolute_path_to_pdf, options, ()=>console.log("Starting…"))
processor.on('complete', data => callback(null, data))
processor.on('error', callback)
function callback (error, data) { error ? console.error(error) : console.log(data.text_pages[0]) }
