import { checkAuthStatus, logoutUser } from './authUser.js'
import { displayAllImages } from './imageGallery.js'
const galleryContainer = document.getElementById('galleryContainer')
checkAuthStatus(userInfo, loginLink, logoutButton)

// Обробник кнопки виходу
logoutButton.addEventListener('click', () => {
	logoutUser()
})
displayAllImages(galleryContainer)
