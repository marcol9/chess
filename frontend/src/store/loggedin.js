import { writable } from "svelte/store";
export const loggedin = writable(false);


export const savedPosition = writable(
    localStorage.savedPosition? JSON.parse(localStorage.savedPosition) : []);
    savedPosition.subscribe(val => localStorage.setItem("savedPosition",JSON.stringify(val)));