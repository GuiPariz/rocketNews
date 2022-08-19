const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const serviceAccount = require('./firebase-app.json');

initializeApp({
  credential: cert(serviceAccount)
});

const DB = getFirestore();
const EMAILS_COLLECTION = DB.collection('emails')

const useRequest = (fun) =>
  functions
    .region("southamerica-east1")
    .https.onRequest((req, res) => cors(req, res, () => fun(req, res)));

const extractBody = (req) => {
  if (typeof req.body === 'string') return JSON.parse(req.body);
  return req.body;
}

exports.helloWorld = useRequest(async (request, response) => {
  try {
    const body = extractBody(request);

    // validar as informações da request
    if (!body.email) throw new Error("Email não informado");

    const { email } = body;

    // verificar se o email já existe no banco de dados
    const emails_iguais = await EMAILS_COLLECTION.where('email', '==', email).get();
    if (!emails_iguais.empty) throw new Error("Email já existente");

    // executar lógica de cadastrar email
    const ref = EMAILS_COLLECTION.doc(email)

    await ref.set({
      email: email.trim(),
    })

    response.json({ email })
  } catch (err) {
    response.status(500).json(err.message)
  }
});