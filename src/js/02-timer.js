import { Notify } from 'notiflix/build/notiflix-notify-aio';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const input = document.querySelector('#datetime-picker');
const startButton = document.querySelector('button[data-start]');
const days = document.querySelector('span[data-days]');
const hours = document.querySelector('span[data-hours]');
const minutes = document.querySelector('span[data-minutes]');
const seconds = document.querySelector('span[data-seconds]');
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    dateInputValue = selectedDates[0].getTime();
    const nowDate = new Date().getTime();
    if (dateInputValue < nowDate) {
      Notify.warning('Please choose a date in the future');
    } else {
      startButton.removeAttribute('disabled');
    }
  },
};
startButton.setAttribute('disabled', 'true');
const fp = flatpickr('#datetime-picker', options);
let dateInputValue = input.value;
let timerId = null;

startButton.addEventListener('click', () => {
  timerId = setInterval(handleTime, 1000);
});

function handleTime() {
  const nowDate = new Date().getTime();
  const selectedDate = new Date(dateInputValue).getTime();
  const timeDifer = selectedDate - nowDate;
  const timeConvert = convertMs(timeDifer);
  if (timeDifer <= 0) {
    clearInterval(timerId);
    return;
  }
  days.textContent = timeConvert.days;
  hours.textContent = timeConvert.hours;
  minutes.textContent = timeConvert.minutes;
  seconds.textContent = timeConvert.seconds;
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
