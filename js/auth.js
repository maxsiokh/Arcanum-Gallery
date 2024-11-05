import { getAnalytics } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js'
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js'
import {
	createUserWithEmailAndPassword,
	getAuth,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
} from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js'

// Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyAUBQqGlhD4BbfI_tBXOhB82LS76vw_jCE',
	authDomain: 'gallerymvp-d5dcc.firebaseapp.com',
	projectId: 'gallerymvp-d5dcc',
	storageBucket: 'gallerymvp-d5dcc.appspot.com',
	messagingSenderId: '1065400842381',
	appId: '1:1065400842381:web:fe6064d0e89c9f10d8cac4',
	measurementId: 'G-01M73S4M34',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const auth = getAuth(app)

// Check if we're on the registration page
const submitButton = document.getElementById('submitbtn')
if (submitButton) {
	submitButton.addEventListener('click', function (event) {
		event.preventDefault()
		const email = document.getElementById('registerEmail').value
		const password = document.getElementById('registerPassword').value
		if (!validateEmail(email)) {
			alert('Будь ласка, введіть коректну електронну адресу.')
			return // Зупиняємо виконання, якщо email некоректний
		}
		// Create a new user
		createUserWithEmailAndPassword(auth, email, password)
			.then(userCredential => {
				const user = userCredential.user
				alert('Registration successful!')
				window.location.href = '/login.html' // Redirect to main page
			})
			.catch(error => {
				alert(`Error: ${error.message}`)
			})
	})
}

// Check if we're on the login page
const loginButton = document.getElementById('loginBtn')
if (loginButton) {
	loginButton.addEventListener('click', function (event) {
		event.preventDefault()
		const email = document.getElementById('loginEmail').value
		const password = document.getElementById('loginPassword').value

		// Перевірка формату електронної адреси
		if (!validateEmail(email)) {
			alert('Будь ласка, введіть коректну електронну адресу.')
			return // Зупиняємо виконання, якщо email некоректний
		}

		signInWithEmailAndPassword(auth, email, password)
			.then(userCredential => {
				const user = userCredential.user
				alert('Вхід успішний!')
				window.location.href = '/index.html' // Переадресація на головну сторінку
			})
			.catch(error => {
				if (error.code === 'auth/invalid-credential') {
					alert('Неправильний логін або пароль. Спробуйте ще раз.')
				} else if (error.code === 'auth/user-not-found') {
					alert('Користувача з такою електронною адресою не знайдено.')
				}
			})
	})
}

// Функція перевірки електронної адреси
function validateEmail(email) {
	const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Проста перевірка формату email
	return re.test(email)
}

//reset password
const resetPasswordButton = document.getElementById('resetPasswordButton')
const resetPasswordForm = document.getElementById('resetPasswordForm')
const sendResetEmailButton = document.getElementById('sendResetEmailButton')
const overlay = document.querySelector('.overlay')

// Показуємо форму для відновлення пароля
resetPasswordButton.addEventListener('click', () => {
	if (
		resetPasswordForm.style.display === 'none' ||
		resetPasswordForm.style.display === ''
	) {
		overlay.style.display = 'block'
		resetPasswordForm.style.display = 'block' // Показуємо форму
	} else {
		resetPasswordForm.style.display = 'none' // Ховаємо форму при повторному натисканні
		overlay.style.display = 'none'
	}
})

// Відправляємо запит на відновлення пароля
sendResetEmailButton.addEventListener('click', async event => {
	event.preventDefault()
	const email = document.getElementById('resetEmail').value

	if (email) {
		try {
			await sendPasswordResetEmail(auth, email)
			alert(
				'Лист для відновлення пароля надіслано. Перевірте свою електронну пошту.'
			)
			resetPasswordForm.style.display = 'none' // Ховаємо форму після успішного відправлення
			overlay.style.display = 'none' // Ховаємо фон
		} catch (error) {
			alert(
				`Помилка при відправці листа для відновлення пароля: ${error.message}`
			)
		}
	} else {
		alert('Будь ласка, введіть електронну пошту.')
	}
})
overlay.addEventListener('click', event => {
	closePasswordResetForm()
})
// Функція для закриття форми
function closePasswordResetForm() {
	resetPasswordForm.style.display = 'none'
	overlay.style.display = 'none'
}
