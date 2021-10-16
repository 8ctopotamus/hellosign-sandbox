require('dotenv').config()
const fs = require('fs')
const pdf = require('html-pdf')
const hellosign = require('hellosign-sdk')({ key: process.env.HELLOSIGN_API_KEY })

const readFilePromise = () => {
  return new Promise((resolve, reject) => {
    fs.readFile('template.html', 'utf-8', function(err, data) {
      if (err) reject(err)
      resolve(data)
    });
  })
}

const generatePDFPromise = html => {
  return new Promise((resolve, reject) => {
    pdf.create(html).toFile('./template.pdf', function(err, res) {
      if (err) return reject(err);
      resolve(res);
    });
  })
}

const init = async () => {
  // read html file
  const html = await readFilePromise()
  // generate a PDF
  const { filename } = await generatePDFPromise(html)
  // upload PDF to hellosign and send to email
  const opts = {
    test_mode: 1,
    title: 'NDA with Acme Co.',
    subject: 'The NDA we talked about',
    message: 'Please sign this NDA and then we can discuss more. Let me know if you have any questions.',
    signers: [
      {
        email_address: 'zylo.codes@gmail.com',
        name: 'Josh'
      },
      {
        email_address: 'gravetotkd@gmail.com',
        name: 'David'
      }
    ],
    files: [filename],
    use_text_tags: 1,
    hide_text_tags: 1
  };
  
  hellosign.signatureRequest.send(opts).then((res) => {
    console.log(res)
    // handle response
  }).catch((err) => {
    // handle error
    console.log(err)
  });
}

init()
