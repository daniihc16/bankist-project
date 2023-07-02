'use strict';
// Data
const account1 = {
    owner: 'Daniel Herce',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
};

const account2 = {
    owner: 'admin',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
};

const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};

const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Creates the usernames for each account owner with the first letter of their names
const createUsernames = function (accounts) {
    accounts.forEach(function (acc) {
        acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
    });
}

// Displays movements in the containerMovements element
const displayMovements = function(account, sort = false) {
    containerMovements.innerHTML = '';

    account.movements.forEach(function(mov, i) {
        const type = mov > 0 ? 'deposit' : 'withdrawal';
        const html = `
        <div class="movements__row">
            <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
            <div class="movements__date">3 days ago</div>
            <div class="movements__value">${mov}€</div>
        </div>`;

        containerMovements.insertAdjacentHTML('afterbegin', html);
    })
}

// Displays the balance in the labelBalance element
const calcDisplayBalance = function(account) {
    labelBalance.textContent = `${account.movements.reduce((acc, mov) => acc + mov, 0)}€`;
}

// Displays the summary in the labelSumIn, labelSumOut, labelSumInterest elements
const calcDisplaySummary = function(account) {
    labelSumIn.textContent = `${account.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov)}€`
    labelSumOut.textContent = `${Math.abs(account.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov))}€`
    labelSumInterest.textContent = `${account.movements.filter(mov => mov > 0)
                                        .map((mov => (mov * account.interestRate) / 100))
                                        .reduce((acc, mov) => acc + mov)}€`
}

// 
btnLogin.addEventListener('click', function(event) {
    // Prevent form from submitting: Default behaviour of the form is to submit the data to the server when the button is clicked and the page is refreshed
    event.preventDefault();

    const loggedAccount = accounts.find(acc => acc.username === inputLoginUsername.value && acc.pin === Number(inputLoginPin.value));
    if (!loggedAccount) console.log('LOGIN ATTEMPT', inputLoginUsername.value, inputLoginPin.value);
    else {
        console.log(`LOGIN SUCCESSFUL as ${loggedAccount.owner}`);

        // Display UI and message
        labelWelcome.textContent = `Welcome back, ${loggedAccount.owner.split(' ')[0]}`;
        containerApp.style.opacity = 100;

        // Clear input fields
        inputLoginUsername.value = inputLoginPin.value = '';
        inputLoginPin.blur();   // Removes focus from the input field so that the cursor is not blinking in the input field

        
        displayMovements(loggedAccount);
        calcDisplayBalance(loggedAccount);
        calcDisplaySummary(loggedAccount);
    }
})

createUsernames(accounts);
