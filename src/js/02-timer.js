import 'flatpickr/dist/flatpickr.min.css';
import flatpickr from 'flatpickr';
import Notiflix from 'notiflix';

const timerFields = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
  buttonStart: document.querySelector('[data-start]'),
};

let startTime = 0;
let endTime = 0;
let timeDifference = 0;

const options = {
  enableTime: true,
  time_24hr: true,
  minDate: new Date().fp_incr(0), //daty wcześniejsze niż dziś będą nieaktywne
  defaultDate: new Date(),
  minuteIncrement: 1,
  closeAfterSelection: true,
  onClose(selectedDates) {
    if (selectedDates[0] <= options.defaultDate) {
      Notiflix.Notify.failure(`❌ Please choose a date in the future`); // pojawi się tylko jeśli się poda godzinę wcześniejszą niż aktualna
      //alert('Please choose a date in the future'); 
      timerFields.buttonStart.setAttribute('disabled', 'disabled');
    } else {
      timerFields.buttonStart.removeAttribute('disabled');
      startTime = options.defaultDate.getTime();
      endTime = selectedDates[0].getTime();
      populateTimeFields(startTime, endTime);
    }
  },
};
flatpickr('#datetime-picker', options);

function populateTimeFields(start, end) {
  const dateDifference = end - start;
  timeDifference = convertMs(dateDifference);
  timerFields.days.textContent = addLeadingZero(timeDifference.days);
  timerFields.hours.textContent = addLeadingZero(timeDifference.hours);
  timerFields.minutes.textContent = addLeadingZero(timeDifference.minutes);
  timerFields.seconds.textContent = addLeadingZero(timeDifference.seconds);
}

timerFields.buttonStart.addEventListener('click', countingDown);

function countingDown() {
  let secondsCount = timeDifference.seconds;
  let minutesCount = timeDifference.minutes;
  let hoursCount = timeDifference.hours;
  let daysCount = timeDifference.days;

  const count = setInterval(() => {
    secondsCount--;
    if (secondsCount >= 0) {
      timerFields.seconds.textContent = addLeadingZero(secondsCount);
    } else if (secondsCount < 0 && minutesCount > 0) {
      minutesCount--;
      secondsCount = 59;
      timerFields.seconds.textContent = addLeadingZero(secondsCount);
      timerFields.minutes.textContent = addLeadingZero(minutesCount)
    } else if (secondsCount < 0 && minutesCount === 0 && hoursCount > 0) {
      hoursCount--;
      minutesCount = 59;
      secondsCount = 59;
      timerFields.seconds.textContent = addLeadingZero(secondsCount);
      timerFields.minutes.textContent = addLeadingZero(minutesCount);
      timerFields.hours.textContent = addLeadingZero(hoursCount)
    } else if (secondsCount < 0 && minutesCount === 0 && hoursCount === 0 && daysCount > 0) {
      daysCount--;
      hoursCount = 23;
      minutesCount = 59;
      secondsCount = 59;
      timerFields.seconds.textContent = addLeadingZero(secondsCount);
      timerFields.minutes.textContent = addLeadingZero(minutesCount);
      timerFields.hours.textContent = addLeadingZero(hoursCount)
      timerFields.days.textContent = addLeadingZero(daysCount)
    }
  }, 1000)
}

function addLeadingZero(num) {
  return num.toString().padStart(2, "0");
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return {
    days,
    hours,
    minutes,
    seconds
  };
}