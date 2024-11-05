import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js'
import {
	getAuth,
	onAuthStateChanged,
	signOut,
} from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js'
import {
	getDownloadURL,
	getStorage,
	listAll,
	ref,
	uploadBytesResumable,
} from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js'

// Firebase конфігурація
const firebaseConfig = {
	apiKey: 'AIzaSyAUBQqGlhD4BbfI_tBXOhB82LS76vw_jCE',
	authDomain: 'gallerymvp-d5dcc.firebaseapp.com',
	projectId: 'gallerymvp-d5dcc',
	storageBucket: 'gallerymvp-d5dcc.appspot.com',
	messagingSenderId: '1065400842381',
	appId: '1:1065400842381:web:fe6064d0e89c9f10d8cac4',
	measurementId: 'G-01M73S4M34',
}

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const storage = getStorage(app)
const db = getFirestore(app)
const listRef = ref(storage, 'images')

//елементи на сторінці
const userInfo = document.getElementById('userInfo')
const loginLink = document.getElementById('loginLink')
const logoutButton = document.getElementById('logoutButton')
const fileInput = document.getElementById('fileInput')
const uploadButton = document.getElementById('uploadButton')
const messageDiv = document.getElementById('messageDiv')
const galleryContainer = document.getElementById('galleryContainer')

// Перевірка статусу авторизації
onAuthStateChanged(auth, user => {
	if (user) {
		userInfo.textContent = ${user.email}
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

// Кнопка виходу
logoutButton.addEventListener('click', () => {
	signOut(auth)
		.then(() => {
			alert('Ви вийшли з акаунту')
			window.location.reload()
		})
		.catch(error => {
			alert(Помилка при виході: ${error.message})
		})
})

// Обробник кнопки завантаження фото на базу
uploadButton.addEventListener('click', async event => {
	event.preventDefault()
	const user = auth.currentUser // Отримуємо поточного користувача
	if (user) {
		// чи ваторизований
		const file = fileInput.files[0]
		if (file) {
			const imagesRef = ref(storage, images/${user.uid}/${file.name})
			const uploadTask = uploadBytesResumable(imagesRef, file)

			uploadTask.on(
				'state_changed',
				snapshot => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100
					// const progressTxt = document.createElement('p')
					// progressTxt.value = progress
					// document.querySelector('.fileInput-box').appendChild(progressTxt)
					console.log(Завантажено ${progress}%)
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
		// Показуємо повідомлення, якщо користувач не авторизований
		messageDiv.innerText = 'Спочатку потрібно авторизуватись.'
		messageDiv.style.display = 'block'
	}
})

// показ фото ===========================================================
async function displayAllImages() {
	const galleryContainer = document.getElementById('galleryContainer')
	const listRef = ref(storage, 'images/')

	try {
		const result = await listAll(listRef)
		await displayImagesRecursively(result, galleryContainer)
	} catch (error) {
		console.error('Помилка при отриманні зображень:', error.message)
	}
}

async function displayImagesRecursively(result, galleryContainer) {
	for (const item of result.items) {
		const url = await getDownloadURL(item)
		const imgDiv = document.createElement('div')
		imgDiv.className = 'img_wrap'
		galleryContainer.appendChild(imgDiv)

		const imgElement = document.createElement('img')
		imgElement.className = 'photo'
		imgElement.src = url
		imgDiv.appendChild(imgElement)
	}

	for (const folder of result.prefixes) {
		const subResult = await listAll(folder) // Рекурсивний пошук у підпапках
		await displayImagesRecursively(subResult, galleryContainer)
	}
}

displayAllImages()