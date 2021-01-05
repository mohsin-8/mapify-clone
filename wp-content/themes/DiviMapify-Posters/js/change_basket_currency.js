// Change basket currency main site

// Before the currency is change the page needs to be reloaded
// (I don't know why!). We set a #reload_change_currency in the url
// so when it loads we know we need to continue resetting the currency
function changeCurrency(currency) {
	localStorage.setItem("currency", currency);
	window.location.hash = 'reload_change_currency';
	window.location.reload();
}

// Once the page has reloaded and Snipcart is ready
// We get to work changing the currency because we see
// the #reload_change_currency in the url
document.addEventListener("DOMContentLoaded", function(event) { 
	if(window.location.hash == "#reload_change_currency"){
		console.log("The Page has been reloaded!");
		document.addEventListener('snipcart.ready', () => {
			changeCurrencyThing();
		});
	}
});


// Get prices from the product api
async function getItemPrice(id, currency) {
	const url='https://orders.mapify-studio.com/products/' + id;
    const response = await fetch(url, {});
    const json = await response.json();

    return json['Price ' + currency.toUpperCase()];
}

// Change the basket currency
async function changeCurrencyThing(){
	// Get the currency from local storage
	var currency = localStorage.getItem('currency');

	// Get all existing items
	const {items} = window.Snipcart.store.getState().cart.items;

	if (typeof items !== "undefined" && items.length > 0) {
		// loop through items and change the price
		var newItems = await Promise.all(items.map(async item => {
	      return {
	        ...item,
	        price: await getItemPrice(item.id, currency)
	      };
	    }));
	} 
	
	// Switch the cart currency
	window.Snipcart.api.session.setCurrency(currency.toLowerCase());

	if (typeof items !== "undefined" && items.length > 0) {
		// Add newItems to cart
		await Promise.all(newItems.map(item => window.Snipcart.api.cart.items.add(item)));
		//window.location = window.location.pathname;
	} else {
		//location.reload(true);
	}
}

// Set the currency in the menu to what is selected in snipcart/localstorage
function setActiveCurrencyMenu() {
	var currency = localStorage.getItem('currency');
	console.log(`Currency: ${currency}`);
	const dict = {
		"EUR": "€",
		"GBP": "£",
		"USD": "$"
	};
	document.getElementById('active_currency').innerHTML = dict[currency.toUpperCase()];
}

// Set the currency when page is first visited
function setCurrencyOnStart() {
	const defaultCurrency = 'EUR';
	if (localStorage.getItem("currency") === null) {
		console.log('No currency set, setting default');
		localStorage.setItem("currency", defaultCurrency);
	}
}

setCurrencyOnStart();
setActiveCurrencyMenu();
document.addEventListener('snipcart.ready', () => {
	// Set a currency if not already done
	var currency = localStorage.getItem('currency');
	// Don't set the currency if the #reload_change_currency is going to do it
	if(window.location.hash !== "#reload_change_currency"){
		Snipcart.api.session.setCurrency(currency.toLowerCase());
	}
});

// Menu
/*
<li class="menu-item-has-children currency_switcher">
	<a id="active_currency">€</a> 
	<ul class="sub-menu">
		<li class="menu-item menu-item-type-custom menu-item-object-custom">
			<a href="#currency_switcher" onclick="changeCurrency('EUR')">€ (EUR)</a>
		</li>
		<li class="menu-item menu-item-type-custom menu-item-object-custom">
			<a href="#currency_switcher" onclick="changeCurrency('USD')">$ (USD)</a>
		</li>
		<li class="menu-item menu-item-type-custom menu-item-object-custom">
			<a href="#currency_switcher" onclick="changeCurrency('GBP')">£ (GBP)</a>
		</li>
	</ul>
</li>
*/