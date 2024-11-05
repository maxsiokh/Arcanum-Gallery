// imageGallery.js
import {
	getDownloadURL,
	listAll,
	ref,
	uploadBytesResumable,
} from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js'
import { storage } from './firebaseConfig.js'

// Завантаження зображення для користувача
export function uploadImage(file, user) {
	const imagesRef = ref(storage, `images/${user.uid}/${file.name}`)
	return uploadBytesResumable(imagesRef, file)
}

// Відображення всіх зображень у галереї
export async function displayAllImages(galleryContainer) {
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
// Відображення зображень поточного користувача
export async function displayUserImages(galleryContainer, userId) {
	const listRef = ref(storage, `images/${userId}`)

	try {
		const result = await listAll(listRef)
		await displayImagesRecursively(result, galleryContainer)
	} catch (error) {
		console.error('Помилка при отриманні зображень:', error.message)
	}
}
