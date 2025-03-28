// ==UserScript==
// @name         Auto Click Check-in/Check-out 
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  Auto click check-in and check-out buttons on a specific website
// @author       You
// @match        https://rrhh.tramitapp.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const checkinTime = "09:00"; // Set your check-in time (24-hour format)
    const checkoutTime = "18:00"; // Set your check-out time (24-hour format)
    const holidays = ["2023-12-25", "2024-01-01"]; // Add your holidays here (YYYY-MM-DD format)

    let autoClicking = false;
    let timeoutId;

    console.log("Auto Click Check-in/Check-out script loaded.");

    // Wait 2 seconds before adding the button
    setTimeout(function() {
        createToggleButton();
        //createToggleButton_Bottom();
    }, 2000);

    const myToggleSelector = '.farm-toggle-button';
    function createToggleButton() {
        // Find the check-in/check-out button container
        const checkinButtonContainer = document.querySelector('button.tw-bg-state-green.tw-h-72.tw-w-72.tw-rounded-full, button.tw-bg-state-red.tw-h-72.tw-w-72.tw-rounded-full');
        
        if (checkinButtonContainer) {
            // Get the parent element (likely a flex container)
            const parentContainer = checkinButtonContainer.parentElement;
            
            // Create the toggle button
            const toggleButton = document.createElement('button');
            toggleButton.className = 'farm-toggle-button';
            toggleButton.textContent = 'Auto Clicking: OFF';
            toggleButton.style.backgroundColor = 'red';
            toggleButton.style.color = 'white';
            toggleButton.style.padding = '10px 15px';
            toggleButton.style.borderRadius = '5px';
            toggleButton.style.marginLeft = '10px';
            toggleButton.style.cursor = 'pointer';
            toggleButton.style.border = 'none';
            toggleButton.style.fontWeight = 'bold';
            
            toggleButton.addEventListener('click', toggleAutoClicking);
            
            // Insert the toggle button next to the check-in/check-out button
            parentContainer.appendChild(toggleButton);
        } else {
            console.log("Could not find the check-in/check-out button. Retrying in 1 second...");
            setTimeout(createToggleButton, 1000); // Retry after 1 second
        }
    }

    function toggleAutoClicking() {
        autoClicking = !autoClicking;
        const toggleButton = document.querySelector('.farm-toggle-button');
        
        if (autoClicking) {
            toggleButton.textContent = 'Auto Clicking: ON';
            toggleButton.style.backgroundColor = 'green';
            startAutoClicking();
        } else {
            toggleButton.textContent = 'Auto Clicking: OFF';
            toggleButton.style.backgroundColor = 'red';
            clearInterval(timeoutId);
        }
    }

    function startAutoClicking() {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const dayOfWeek = now.getDay();

        // Check if today is a weekend or holiday
        if (dayOfWeek === 0 || dayOfWeek === 6 || holidays.includes(today)) {
            console.log("Today is a weekend or holiday. No action taken.");
            return;
        }

        const checkinDateTime = new Date(`${today}T${checkinTime}:00`);
        const checkoutDateTime = new Date(`${today}T${checkoutTime}:00`);

        if (now < checkinDateTime) {
            const timeUntilCheckin = checkinDateTime - now;
            timeoutId = setTimeout(() => {
                performCheckin();
                startAutoClicking();
            }, timeUntilCheckin);
        } else if (now >= checkinDateTime && now < checkoutDateTime) {
            const timeUntilCheckout = checkoutDateTime - now;
            timeoutId = setTimeout(() => {
                performCheckout();
            }, timeUntilCheckout);
        }
    }

    function performCheckin() {
        const checkinButton = document.querySelector('button.tw-bg-state-green.tw-h-72.tw-w-72.tw-rounded-full');
        if (checkinButton) {
            checkinButton.click();
            setTimeout(() => {
                const confirmButton = document.querySelector('button.tw-pb-8.btn.btn-block.btn-lg.tw-bg-state-green.tw-border-state-green.tw-text-white');
                if (confirmButton) {
                    confirmButton.click();
                    console.log("Check-in completed.");
                }
            }, 1000);
        }
    }

    function performCheckout() {
        const checkoutButton = document.querySelector('button.tw-bg-state-red.tw-h-72.tw-w-72.tw-rounded-full');
        if (checkoutButton) {
            checkoutButton.click();
            setTimeout(() => {
                const confirmButton = document.querySelector('button.tw-pb-8.btn.btn-block.btn-lg.btn-danger');
                if (confirmButton) {
                    confirmButton.click();
                    console.log("Check-out completed.");
                }
            }, 1000);
        }
    }
})();