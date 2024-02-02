"use client"

export default function Button_Menu() {

	return (
		<>
			<button onClick={() => {
				let button_menu = document.querySelector('.button_menu') as HTMLButtonElement
				let menu = document.querySelector('.menu') as HTMLDivElement
				let bar_elements = document.querySelectorAll('.bar_element') as NodeListOf<HTMLSpanElement>



				if (button_menu.dataset.opened === 'true') {
					bar_elements.forEach((element) => {
						element.style.backgroundColor = 'var(--color-text)'
					})
					bar_elements[0].style.transform = 'translateX(-3px)'
					bar_elements[2].style.transform = 'translateX(3px)'
					menu.style.opacity = '0';
					menu.style.width = '0px'
					menu.style.height = '0px'
					button_menu.dataset.opened = 'false'
				}
				else {
					bar_elements.forEach((element) => {
						element.style.backgroundColor = 'var(--color-focus)'
					})
					bar_elements[0].style.transform = 'translateX(3px)'
					bar_elements[2].style.transform = 'translateX(-3px)'
					menu.style.opacity = '1';
					menu.style.width = '195px'
					menu.style.height = '170px'
					button_menu.dataset.opened = 'true'
				}				

			}} type="button" data-opened="false" className="button_menu">
					<span className="bar_element"></span>
					<span className="bar_element"></span>
					<span className="bar_element"></span>
			</button>
		</>
	)
}