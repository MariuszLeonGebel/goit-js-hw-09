const body = document.body;
const buttonStart = document.querySelector('button[data-start]');
const buttonStop = document.querySelector('button[data-stop]');
let colorChanger = null;

buttonStart.addEventListener('click', () => {
  colorChanger = setInterval(() => {
    const chooseColor = getRandomHexColor();
    body.style.backgroundColor = chooseColor;
  }, 1000);

  buttonStart.setAttribute('disabled', 'disabled');
  buttonStop.removeAttribute('disabled')
});

buttonStop.addEventListener('click', () => {
  clearInterval(colorChanger);

  buttonStop.setAttribute('disabled', 'disabled');
  buttonStart.removeAttribute('disabled')
})

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}