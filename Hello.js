// ==UserScript==
// @name         Google Hello World
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Log Hello World to console on Google
// @match        https://www.google.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Log Hello World to the console
    console.log('Hello World');
})();