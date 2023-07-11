'use strict';
// Data
const account1 = {
    owner: 'Daniel Herce',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,
  
    movementsDates: [
      '2019-11-18T21:31:17.178Z',
      '2019-12-23T07:42:02.383Z',
      '2020-01-28T09:15:04.904Z',
      '2020-04-01T10:17:24.185Z',
      '2020-05-08T14:11:59.604Z',
      '2020-05-27T17:01:17.194Z',
      '2020-07-11T23:36:17.929Z',
      '2023-07-06T10:51:36.790Z',
    ],
    currency: 'EUR',
    locale: 'pt-PT', // de-DE
  };
  
  const account2 = {
    owner: 'admin',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
  
    movementsDates: [
      '2019-11-01T13:15:33.035Z',
      '2019-11-30T09:48:16.867Z',
      '2019-12-25T06:04:23.907Z',
      '2020-01-25T14:18:46.235Z',
      '2020-02-05T16:33:06.386Z',
      '2020-04-10T14:43:26.374Z',
      '2020-06-25T18:49:59.371Z',
      '2020-07-26T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
  };
  
  const account3 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1.2, // %
    pin: 3333,
  
    movementsDates: [
      '2019-12-23T07:42:02.383Z',
      '2020-04-01T10:17:24.185Z',
      '2020-05-08T14:11:59.604Z',
      '2020-07-11T23:36:17.929Z',
      '2020-07-12T10:51:36.790Z',
    ],
    currency: 'EUR',
    locale: 'pt-PT', // de-DE
  };
  
  const account4 = {
    owner: 'Silvia Sulivan',
    movements: [4430, 100, 1700, -50, -790],
    interestRate: 1.5,
    pin: 4444,
  
    movementsDates: [
      '2019-12-25T06:04:23.907Z',
      '2020-01-25T14:18:46.235Z',
      '2020-02-05T16:33:06.386Z',
      '2020-04-10T14:43:26.374Z',
      '2020-07-26T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
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




// Updates the account balance based on the movements array
// This would be better if it was a method of the account object, but we'd have to implement inheritance 
// to do that and I want to do this project without inheritance
const updateAccountBalance = function(account) {
   
    // If the account balance is not set, calculate it from the movements array
    if(!account.balance) {

        account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
        account.movementsInBalance = account.movements.length;

    } else if (account.movements.length > account.movementsInBalance) {
        // If the account balance is set, update it based on the movements array

        for (let i = account.movementsInBalance; i < account.movements.length; i++) {
            account.balance += account.movements[i];
        }
        account.movementsInBalance = account.movements.length;
    }
}


// Creates unique usernames for each account based on the owner's name and adds it to the account object.
// The username is the first letter of each word in the owner's name. If there are more than one account
// with the same username, a number is added to the end of it.
const createUsernames = function (accounts) {
    accounts.forEach(function (acc, i) {
        const usernameBase = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
        let usernameFinal = usernameBase;

        // If there are more than one account with the same username, add a number to the end of it
        while (accounts.slice(0, i).findIndex(acc => acc.username === usernameFinal) != -1) {
            usernameFinal = usernameBase + Math.trunc(Math.random() * MAX_SAME_USERNAME);
        }

        acc.username = usernameFinal;
    });
}


// Formats the date based on the locale
const formatDate = function(date, locale) {
    
    const daysPassed = Math.round(Math.abs(new Date() - date) / (1000 * 60 * 60 * 24));
    switch (daysPassed) {
        case 0:
            return 'Today';
            break;
        case 1:
            return 'Yesterday';
            break;
        default:
            return new Intl.DateTimeFormat(locale).format(date);
    }
}


// Formats the currency based on the locale
const formatCurrency = function(value, locale, currency) {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
    }).format(value);
}


// Displays movements in the containerMovements element
const displayMovements = function(account, sort = false) {
    containerMovements.innerHTML = '';

    // Sort movements in ascending order if sort is true
    const movs = sort ? account.movements.slice().sort((a, b) => a - b) : account.movements.slice();
    
    movs.forEach(function(mov, i) {
        const backgroundColor = i % 2 === 0 ? 'background-color: #ebeef2' : '';
        const type = mov > 0 ? 'deposit' : 'withdrawal';
        const movDate = new Date(account.movementsDates[i]);
        
        const html = `
        <div class="movements__row " style="${backgroundColor}">
            <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
            <div class="movements__date">${formatDate(movDate, account.locale)}</div>
            <div class="movements__value">${formatCurrency(mov, account.locale, account.currency)}</div>
        </div>`;

        containerMovements.insertAdjacentHTML('afterbegin', html);
    })
}


// Displays the balance in the labelBalance element
const calcDisplayBalance = function(account) {
    updateAccountBalance(account);
    labelBalance.textContent = `${formatCurrency(account.balance, account.locale, account.currency)}`;
}


// Displays the summary in the labelSumIn, labelSumOut, labelSumInterest elements
const calcDisplaySummary = function(account) {
    labelSumIn.textContent = `${formatCurrency(
        account.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov).toFixed(2),
        account.locale, account.currency)}`
    
    labelSumOut.textContent = `${formatCurrency(
        Math.abs(account.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov)).toFixed(2), 
        account.locale, account.currency)}`
    
    labelSumInterest.textContent = `${formatCurrency(
        account.movements.filter(mov => mov > 0)
        .map((mov => (mov * account.interestRate) / 100))
        .reduce((acc, mov) => acc + mov).toFixed(2)
        , account.locale, account.currency)}`

}

// Updates the UI with the account data
const updateUI = function(account) {
    // Display movements
    displayMovements(account);

    // Display balance
    calcDisplayBalance(account);

    // Display summary
    calcDisplaySummary(account);
}


// Event handler for the login button, sets the loggedAccount variable to the account that is logged in
btnLogin.addEventListener('click', function(event) {
    // Prevent form from submitting: Default behaviour of the form is to submit the data to the server when the button is clicked and the page is refreshed
    event.preventDefault();

    loggedAccount = accounts.find(acc => acc.username === inputLoginUsername.value && acc.pin === Number(inputLoginPin.value));
    if (!loggedAccount) console.log('LOGIN ATTEMPT', inputLoginUsername.value, inputLoginPin.value);
    else {
        console.log(`LOGIN SUCCESSFUL as ${loggedAccount.owner}`);
   
        // Set the date in the labelDate element formated based on the locale with the hour and minutes
        labelDate.textContent = new Date().toLocaleString(loggedAccount.locale, {
            hour: 'numeric',
            minute: 'numeric',
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
        });
        
        // Clear the logout timer and start it again
        if(loggoutTimer) clearInterval(loggoutTimer);
        setLogOutTimer();

        // Display UI and message
        labelWelcome.textContent = `Welcome back, ${loggedAccount.owner.split(' ')[0]}`;
        containerApp.style.opacity = 100;

        // Clear input fields
        inputLoginUsername.value = inputLoginPin.value = '';
        inputLoginPin.blur();   // Removes focus from the input field so that the cursor is not blinking in the input field

        
        updateUI(loggedAccount);
    }
})


// Event handler for the transfer button
btnTransfer.addEventListener('click', function(event) {
    event.preventDefault();

    const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
    const amount = Number(inputTransferAmount.value);

    inputTransferTo.value = inputTransferAmount.value = '';

    // Transfer money only if the amount is positive, the logged account has enough money and the receiver account exists and is not the same as the logged account
    if(amount > 0 && loggedAccount.balance >= amount && receiverAcc && receiverAcc?.username != loggedAccount.username) {
        console.log(`TRANSFER SUCCESSFUL: ${amount}€ to ${receiverAcc?.username}`);
        
        loggedAccount.movements.push(-amount);
        loggedAccount.movementsDates.push(new Date().toISOString());
        
        receiverAcc.movements.push(amount);
        receiverAcc.movementsDates.push(new Date().toISOString());
        
        clearInterval(loggoutTimer);
        setLogOutTimer();

        updateUI(loggedAccount);
    } else {
        console.log(`TRANSFER ERROR: ${amount}€ to ${receiverAcc?.username}`);
    }

});


// Event handler for the close account button
btnClose.addEventListener('click', function(event) {
    event.preventDefault();
    
    if (inputCloseUsername.value === loggedAccount.username && Number(inputClosePin.value) === loggedAccount.pin) {
        const index = accounts.findIndex(acc => acc.username === loggedAccount.username);
        accounts.splice(index, 1);

        // Hide UI
        containerApp.style.opacity = 0;
    } else {
        console.log(`CLOSE ACCOUNT ERROR: ${inputCloseUsername.value} ${inputClosePin.value}`);
    }

    inputCloseUsername.value = inputClosePin.value = '';    
});


// Event handler for the loan button
btnLoan.addEventListener('click', function(event) {
    event.preventDefault();

    const amount = Number(inputLoanAmount.value);

    // Grant loan only if the amount is positive and the logged account has a movement of at least 10% of the requested amount
    // This is just to show how to use the some() method
    //! SIDE EFFECT: as we add the movement of the loan to the movements array, the loan is counted as a movement and the user 
    //! can request a new bigger loan as this last movement wold be bigger than 10% of the new loan
    //! Example: if the user has a movement of 1000€ and requests a loan of 10000€, the user will have a movement of 10000€ and can request a new loan of 100000€
    if (amount > 0 && loggedAccount.movements.some(mov => mov >= amount * 0.1)) {
        loggedAccount.movements.push(amount);
        loggedAccount.movementsDates.push(new Date().toISOString());
        setTimeout(updateUI.bind(null,loggedAccount), 1000);  // Simulate a delay of 1 second to update the UI
        console.log(`LOAN SUCCESSFUL: ${amount}€`);

        clearInterval(loggoutTimer);
        setLogOutTimer();
    } else {
        console.log(`LOAN ERROR: ${amount}€`);
    }

    inputLoanAmount.value = '';
});


// Event handler for the sort button
btnSort.addEventListener('click', function(event) {
    event.preventDefault();

    sorted = !sorted;
    displayMovements(loggedAccount, sorted);
});    
    

// Event handler for the logout timer
const setLogOutTimer = function () {
    let time = SESSION_TIMEOUT - 1;

    loggoutTimer = setInterval(function() {
        labelTimer.textContent = `${String(Math.trunc(time / 60)).padStart(2,0)}:${String(time % 60).padStart(2, '0')}`;
        time--;

        if (time < 0) {
            console.log(`LOGOUT: ${loggedAccount.owner}`);
            containerApp.style.opacity = 0;
            clearInterval(loggoutTimer);
        }
    }, 1000);
}

    

// Constants
const MAX_SAME_USERNAME = 100;  // Maximum number of accounts with the same username where a number is added to the end of it
const SESSION_TIMEOUT = 60 * 5;   // Seconds of inactivity before the user is logged out

let loggedAccount;  // Global variable to store the logged in account
let loggoutTimer;   // Global variable to store the logout timer
let sorted = false; // Global variable to store if the movements are sorted or not



// Main code
createUsernames(accounts);
accounts.forEach(acc => console.log(acc));