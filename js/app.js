import { checkAuthStatus, logoutUser } from './authUser.js'
import { auth } from './firebaseConfig.js' // імпорт auth
import { displayUserImages, uploadImage } from './imageGallery.js'
const userInfo = document.getElementById('userInfo')
const loginLink = document.getElementById('loginLink')
const logoutButton = document.getElementById('logoutButton')
const fileInput = document.getElementById('fileInput')
const uploadButton = document.getElementById('uploadButton')
const galleryContainer = document.getElementById('galleryContainer')
const messageDiv = document.getElementById('messageDiv')
const progressContainer = document.getElementById('progressContainer')
const progressBar = document.getElementById('progressBar')
// Перевірка авторизації
checkAuthStatus(userInfo, loginLink, logoutButton, messageDiv)

// Обробник кнопки виходу
logoutButton.addEventListener('click', () => {
	logoutUser()
})

// Обробник завантаження фото
uploadButton.addEventListener('click', async event => {
	event.preventDefault()
	const user = auth.currentUser
	if (user) {
		const file = fileInput.files[0]
		if (file) {
			const uploadTask = uploadImage(file, user)
			progressContainer.style.display = 'flex' // Показуємо прогрес

			uploadTask.on(
				'state_changed',
				snapshot => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100
					progressBar.style.width = `${progress}%` // Оновлюємо ширину прогрес-бара
					progressBar.innerText = `${Math.round(progress)}%` // Текст всередині бара
				},
				error => {
					console.error('Помилка завантаження:', error)
					progressContainer.style.display = 'none' // Ховаємо прогрес при помилці
				},
				() => {
					setTimeout(() => {
						progressContainer.style.display = 'none' // Ховаємо прогрес
						window.location.reload()
					}, 1000) // Затримка перед перезавантаженням
				}
			)
		}
	} else {
		messageDiv.innerText = 'Спочатку потрібно авторизуватись.'
		messageDiv.style.display = 'block'
	}
})
// displayUserImages(user)
auth.onAuthStateChanged(user => {
	if (user) {
		displayUserImages(galleryContainer, user.uid)
	}
})
