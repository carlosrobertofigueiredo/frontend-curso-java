/**
 * Configuração do Firebase
 * By Luferat
 * MIT License 
 **/

/**
 * Configurações so Firebase
 * 
 * IMPORTANTE!
 * Troque os valores de 'firebaseConfig' pelos dados do SEU FIREBASE!
 **/
 const firebaseConfig = {
    apiKey: "AIzaSyDEGPx7u46gGlvA-NxFJMrJRpNAD9DFtCs",
    authDomain: "frontendeiros-carlos.firebaseapp.com",
    projectId: "frontendeiros-carlos",
    storageBucket: "frontendeiros-carlos.appspot.com",
    messagingSenderId: "676387430883",
    appId: "1:676387430883:web:8d58f7f87dde1ecd4d00d6"
  };
// Incializa o Firebase
firebase.initializeApp(firebaseConfig);

// Incializa o Firebase Authentication
const auth = firebase.auth();

// Define o provedor de autenticação
var provider = new firebase.auth.GoogleAuthProvider();