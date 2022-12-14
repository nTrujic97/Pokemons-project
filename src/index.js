"use strict";

const paginationNumbers = document.querySelector(".pagination-numbers");
const nextButton = document.querySelector(".next-button");
const prevButton = document.querySelector(".prev-button");
const gridContainer = document.querySelector(".grid-container");
const modals = document.querySelector(".modals");
const overlay = document.querySelector(".overlay");

const init = async function () {
	try {
		const response = await fetch(
			"https://jherr-pokemon.s3.us-west-1.amazonaws.com/index.json"
		);
		const pokemonData = await response.json();

		const paginationLimit = 20;
		const pageCount = Math.ceil(pokemonData.length / paginationLimit);
		let currentPage = 1;

		const appendPageNumber = (index) => {
			const pageNumber = document.createElement("button");
			pageNumber.className = "pagination-number";
			pageNumber.innerHTML = index;
			pageNumber.setAttribute("page-index", index);
			pageNumber.setAttribute("aria-label", "Page " + index);

			paginationNumbers.appendChild(pageNumber);
		};
		const getPaginationNumbers = () => {
			for (let i = 1; i <= pageCount; i++) {
				appendPageNumber(i);
			}
		};

		const handleActivePageNumber = () => {
			document.querySelectorAll(".pagination-number").forEach((button) => {
				button.classList.remove("active");

				const pageIndex = Number(button.getAttribute("page-index"));
				if (pageIndex == currentPage) {
					button.classList.add("active");
				}
			});
		};

		const setCurrentPage = (pageNum) => {
			currentPage = pageNum;
			const prevRange = (pageNum - 1) * paginationLimit;
			const currRange = pageNum * paginationLimit;
			handleActivePageNumber();
			handlePageButtonsStatus();

			const getModal = async function (pokemon) {
				const response = await fetch(
					`https://jherr-pokemon.s3.us-west-1.amazonaws.com/pokemon/${pokemon.id}.json`
				);
				const pokemonData = await response.json();
				const pokemonEl = document.createElement("div");
				pokemonEl.classList.add("modal");
				pokemonEl.classList.add("hidden");
				pokemonEl.setAttribute(`modal-index`, `${pokemon.id}`);
				pokemonEl.innerHTML = `
			<div class="modal-content">
				<span class="close">&times;</span>
				<h2 class="modal__header">${pokemonData.name}</h2>
				<img src="${pokemonData.image}" class="modal_card" alt="it's a pokemon" />
				<div class="stats">
				<p>${pokemonData.stats[0].name} : ${pokemonData.stats[0].value}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${pokemonData.stats[1].name} : ${pokemonData.stats[1].value}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${pokemonData.stats[2].name} : ${pokemonData.stats[2].value}
				</p>
			</div>
			<div class="stats_type">
				<p>His type is  ${pokemonData.type[0]} and he is awesome!</p>
			</div>
			`;

				modals.appendChild(pokemonEl);
			};

			pokemonData.forEach((pokemon, index) => {
				const pokemonEl = document.createElement("div");
				pokemonEl.classList.add("pokemonCard");
				pokemonEl.innerHTML = `
			<div class="card" style="width: 8rem" card-index =${pokemon.id}>
				<img src="${pokemon.image}" class="card-img-top" alt="it's a pokemon" />
				<div class="card-body">
					<p class="card-text">${pokemon.name}</p>
				</div>
				</div>
			`;
				if (index >= prevRange && index < currRange) {
					gridContainer.appendChild(pokemonEl);
					getModal(pokemon);
				}
			});
		};

		const disableButton = (button) => {
			button.classList.add("disabled");
			button.setAttribute("disabled", true);
		};
		const enableButton = (button) => {
			button.classList.remove("disabled");
			button.removeAttribute("disabled");
		};
		const handlePageButtonsStatus = () => {
			if (currentPage === 1) {
				disableButton(prevButton);
			} else {
				enableButton(prevButton);
			}

			if (pageCount === currentPage) {
				disableButton(nextButton);
			} else {
				enableButton(nextButton);
			}
		};

		const loadDelayOverlay = function () {
			overlay.classList.remove("hidden");
			setTimeout(() => {
				overlay.classList.add("hidden");
			}, 2000);
		};

		const paginationInit = function () {
			getPaginationNumbers();
			setCurrentPage(1);

			prevButton.addEventListener("click", () => {
				loadDelayOverlay();
				const cards = document.querySelectorAll(".pokemonCard");
				cards.forEach((card) => card.classList.add("hidden"));
				setCurrentPage(currentPage - 1);
			});
			nextButton.addEventListener("click", () => {
				loadDelayOverlay();
				const cards = document.querySelectorAll(".pokemonCard");
				cards.forEach((card) => card.classList.add("hidden"));
				setCurrentPage(currentPage + 1);
			});

			document.querySelectorAll(".pagination-number").forEach((button) => {
				const pageIndex = Number(button.getAttribute("page-index"));

				if (pageIndex) {
					button.addEventListener("click", () => {
						loadDelayOverlay();
						const cards = document.querySelectorAll(".pokemonCard");
						cards.forEach((card) => card.classList.add("hidden"));
						setCurrentPage(pageIndex);
					});
				}
			});
		};

		paginationInit();

		const getDelayedElements = function () {
			setInterval(() => {
				const modal = document.querySelectorAll(".modal");
				const cards = document.querySelectorAll(".card");

				const openDisplay = function (modal) {
					modal.classList.remove("hidden");
					overlay.classList.remove("hidden");
				};
				const closeDisplay = function (modal) {
					modal.classList.add("hidden");
					overlay.classList.add("hidden");
				};

				cards.forEach((card) => {
					card.addEventListener("click", (e) => {
						const target = e.currentTarget;
						const cardIndex = target.getAttribute("card-index");
						const modalIndex = document.querySelector(
							`[modal-index='${cardIndex}']`
						);
						openDisplay(modalIndex);
					});
				});

				modal.forEach((modal) => {
					modal.addEventListener("click", () => {
						closeDisplay(modal);
					});
				});

				overlay.addEventListener("click", closeDisplay);
			}, 3000);
		};
		getDelayedElements();
	} catch (err) {
		console.error(err);
	}
};

init();
