// firebaseConfig.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js'
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js'
import { getStorage } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js'

const firebaseConfig = {
	apiKey: 'AIzaSyAUBQqGlhD4BbfI_tBXOhB82LS76vw_jCE',
	authDomain: 'gallerymvp-d5dcc.firebaseapp.com',
	projectId: 'gallerymvp-d5dcc',
	storageBucket: 'gallerymvp-d5dcc.appspot.com',
	messagingSenderId: '1065400842381',
	appId: '1:1065400842381:web:fe6064d0e89c9f10d8cac4',
	measurementId: 'G-01M73S4M34',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const storage = getStorage(app)
export const db = getFirestore(app)
