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
			uploadTask.on(
				'state_changed',
				snapshot => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100
					console.log(`Завантажено ${progress}%`)
				},
				error => {
					console.error('Помилка завантаження:', error)
				},
				() => {
					// Завантаження завершено, перезавантажуємо сторінку
					window.location.reload()
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
