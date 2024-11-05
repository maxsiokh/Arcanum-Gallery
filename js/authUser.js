// authUser.js
import {
	onAuthStateChanged,
	signOut,
} from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js'
import { auth } from './firebaseConfig.js' // імпорт auth

// Перевірка статусу авторизації
export function checkAuthStatus(userInfo, loginLink, logoutButton, messageDiv) {
	onAuthStateChanged(auth, user => {
		if (user) {
			userInfo.textContent = `${user.email}`
			userInfo.style.display = 'block'
			loginLink.style.display = 'none'
			logoutButton.style.display = 'block'
			messageDiv.style.display = 'none'
		} else {
			userInfo.style.display = 'none'
			loginLink.style.display = 'block'
			logoutButton.style.display = 'none'
		}
	})
}

// Вихід з облікового запису
export function logoutUser() {
	signOut(auth)
		.then(() => {
			alert('Ви вийшли з акаунту')
			window.location.reload()
		})
		.catch(error => {
			alert(`Помилка при виході: ${error.message}`)
		})
}
