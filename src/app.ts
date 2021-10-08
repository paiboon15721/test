import PdfPrinter from 'pdfmake'
import path from 'path'
import express from 'express'
import htmlToPdfmake from 'html-to-pdfmake'
import jsdom from 'jsdom'
const { JSDOM } = jsdom
const { window } = new JSDOM('')

const app = express()

const fonts = {
  FreeSarif: {
    normal: path.join(__dirname, 'fonts/FreeSerif.otf'),
    bold: path.join(__dirname, 'fonts/FreeSerifBold.otf'),
    italics: path.join(__dirname, 'fonts/FreeSerifItalic.otf'),
    bolditalics: path.join(__dirname, 'fonts/FreeSerifBoldItalic.otf'),
  },
  THSarabunNew: {
    normal: path.join(__dirname, 'fonts/THSarabunNew.ttf'),
    bold: path.join(__dirname, 'fonts/THSarabunNewBold.ttf'),
    italics: path.join(__dirname, 'fonts/THSarabunNewBoldItalic.ttf'),
    bolditalics: path.join(__dirname, 'fonts/THSarabunNewItalic.ttf'),
  },
}

const printer = new PdfPrinter(fonts)

app.get('/', (req, res) => {
  res.set('content-type', 'application/pdf')
  res.set('Content-Disposition', 'inline; filename="test.pdf"')
  const html = htmlToPdfmake(
    `
  <div>
    <h1>My title</h1>
    <p>
      This is a sentence with a <strong>bold word</strong>, <em>one in italic</em>,
      and <u>one with underline</u>. And finally <a href="https://www.somewhere.com">a link</a>.
    </p>
  </div>
`,
    { window },
  )
  const docDefinition = {
    defaultStyle: {
      font: 'FreeSarif',
    },
    content: html,
  }

  const pdfDoc = printer.createPdfKitDocument(docDefinition)
  pdfDoc.end()
  pdfDoc.pipe(res)
})

const port = 3200
app.listen(port, () => console.log(`App listening on port ${port}`))
