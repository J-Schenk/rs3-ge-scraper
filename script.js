///<reference path="/alt1lib.js">

currentTab = 0;
imgbought = false;
imgsold = false;
gehist = [];
items = {};
itemswaiting=[];//item names to load with next batch load
itemsloaded = [];//item names that cant have been attempted in batch request
importedIndexes = [];//list of idexes that were inported with the last screenshot

function start() {
	a1lib.identifyUrl("appconfig.json");

	geinterface= new InterfaceTracker(new Rect(-178, 57, 763, 388), 'data:image/png;base64,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');
	/*imgbought*/  ImageData.fromUrl('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAMCAYAAAAQw/9NAAACAklEQVQ4T2PkVNL/zzCIASPIgfdP7GEQFxWBO/PTl68MPnHpDGcuXqGJ00H2haYX4DTf28WBYeueA2C7wQ58cfEoioPKs1MYgjzdGMx9wmjiQHT70C1BlsfqwK6aUgZ7C1O4A0H8tJgwBjZWVoZfv38zzFqyiqGspRtsLnpoIPNPblnFoKupBlYHipXv378zKFq4MIAc8PDxU7jc5eu3UOzKSYwG61m2fgsiBPl4uFE8omLlxvDs5SuGpIhghtqCTLDBMAByRPOE6QzzVqwFW4acHGD8jNgIBnkZKQbXiCSwtjWzJjLYmJswSOhbg/XAHAuSA/GN3ALB9sH4MDOxhiDI5wdPnAaH0pX9mxn6Zi4AOwYGQI5OjwkH+xqXAxdMaEfRB9LTVlkEd2BVex/cTFxmgPIAVgeCDCtKT2DQcfRlADl23fZdDJ1T58AdiJxG0Q2HRTEhB2ILdVimJJgG5/S0wKMH2ecwF4IMgIUAsgdAuW/1zAkMdkExDGG+nijpePeKeQy6murwEMTnQGQzsRYzL1+/QUlzyJkE5MjGvinwEAU5aumUbnAGAunj5OSEp0lQuvNytodnEhADlAbxZSyQGhN9HYY9K+cznL5wGRLFNClL0Awlt+iiqQNBSSWlpAYcIqCoh+V8UgKEpg4EpTtTA12GHz9/MfTPmo+S0Yh1JACqpH71LwVmQQAAAABJRU5ErkJggg==', function (buf) { imgbought = buf });
	/*imgsold*/    ImageData.fromUrl('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAMCAYAAAAQw/9NAAABi0lEQVQ4T2PUsfP4zzCIASOxDty/fhmDiJAg2Cs379xjCEnOJugtkJ68qkaGy9dvYqjV1VRnmNRWz+AYGIXXHKIcuHByN8PVm3cYuqbMBBsW4uvJsGbzdoIOPL5tLUNacRVOB87qbWOw9Aqm3IFr5k5l2HXgMMOsxSswDCvLSWeICPBhYGVlYfj9+w/Dig1b4B5Bd+Dk9gYGBytzsBlv3r1n4GBnp44DxUSEGTYumsXw9PkLhqnzFjPsP3oCHpLZSbEo0QSKVpAaUAgjOxDkETNDPXjSAHlaWlKCOg6EBVtabARDbko8w4FjJxlyKxsYti2fxzBv2WqU6AZFPyhEQWkU2YHoakHqijNTqOtAmENBFvvHpTFM62zCiHqQJ9wcbOnrQJClx8+chyf2c3s2M3hEJDDYWZphhALI8b3T59A3ikHRUZWfBc4IILB49QZ4RkDOJCC5yXMWwjNTW3UJg6+bM4OuvSdYHyjdqasogdmPnz1n4OTgoE4xQ7A8oaECospBGtpP0OhB70AAJyDaWeA3d5AAAAAASUVORK5CYII=', function (buf) { imgsold = buf });
	/*imgnumbers*/ ImageData.fromUrl('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAB4CAYAAADL2GN3AAABa0lEQVRYR92YUXLDIAwF3cv0/jd0rSgYCVZC49LptB8ri8eCyG+O4/OscZ5nid4cH9dnFhpaBokO4cb3xSmsiCQJfhFIAoYEhkRvkrFCb/6TuELLdVvDblowJDAkelMZPQp0wC3usCJG4/1i9cZXk0gChoSW67YRK72cMYjAkOgNjLNoMVJ0YA5WYmm0C7aNvoPKG7N3YkhgSGhJRja0/Ji471fbG6Nb/aI6et8bK2h5/4iGFRq3aEMCQ0JLMrIxB9kbXbBNXL0TQwJDwi8qo61EB8KNEb9YjRbh0ehQnMJMlM1GyyxTEIEhocWMLI8uiZEk+EVFzCShNxVxJQlaqmIFDIneXOOzJ2gZBDrgFneYiXtHl8UpzETZbLTMMgURGBK9ScYKWgaBDrjFHW4Tm/ALo++wKhIYEhgK43gMKXOhfG0v34YTLX9WrIAhoQVGj2gxYnTIL5Kbe7MYr+XJGyO0PBXpIP/1NXEeX49AxWx87bQtAAAAAElFTkSuQmCC', 
		function (buf) { 
			var a, b, c;
			imgnumbers = [];
			for (a = 0; a < 12; a++) { imgnumbers[a] = buf.clone(new Rect(0, a * 10, 10, 10));}
		});
	PasteInput.listen(read, function (t) { message(t); });
	window.onbeforeunload = saveData;
	loadData();
	findIds();
	draw();
}

function saveData() {
	localStorage.gehist_offers = JSON.stringify(gehist);
}

function loadData() {
	if (localStorage.gehist_offers) { gehist = JSON.parse(localStorage.gehist_offers); }
}

function message(text,time) {
	if (!time) { time = 2000; }
	elid("message").innerText = text;
}

function read() {
	var a, b, c, img, pos, gebuf, geref, str, dx;

	//== find the interface with available input ==
	if (window.alt1) { img = a1lib.bindfullrs(); }
	else {
		if (!PasteInput.lastref) { message("Please paste a screenshot of the ge history interface"); return; }
		img = PasteInput.lastref;
	}
	pos = geinterface.find(img);
	if (!pos) { message("GE interface not found"); clog("notfoud"); return; }
	gebuf = geinterface.getFullInterface();
	geref = new ImgRefData(gebuf, new Rect(0, 0, gebuf.width, gebuf.height));

	var scanread = function (x, y, len) {
		var a, b, c, dx, p, xx, yy;
		for (dx = 0; dx < len; dx++) {
			p = gebuf.getPixel(x + dx, y);
			if (p[0] + p[1] + p[2] > 250) {
				xx = geinterface.pos.x + x + dx + 3;
				yy = geinterface.pos.y + y;
				return alt1.bindReadColorString(img.handle, "chatmono", a1lib.mixcolor(255, 255, 255, 255), xx, yy);
			}
		}
		clog("no text found at y=" + (y + geinterface.pos.y));
		return "";
	}

	var readline = function (x, y, buy) {
		var a, b, item, price, amount, rawprice;
		if (y < 16) { return false; }
		if (y > 366) { return false; }
		amount = readItemAmount(gebuf, x + 551, y - 8);
		item = scanread(x + 200, y + 5, 100);
		if (amount == 1) { rawprice = scanread(x + 600, y + 7, 50); }
		else { rawprice = scanread(x + 600, y - 2, 50); }
		price = +rawprice.replace(/,/g, "");

		if (item && price || true) { return { x: x, y: y, item: item, price: price, buy: buy, amount: amount }; }
		else { return false; }
	}

	//== find all offers ==
	var boughtlist = a1lib.findsubimg(geref, imgbought);
	var soldlist = a1lib.findsubimg(geref, imgsold);
	var offers = [];
	for (a in boughtlist) {
		b = readline(boughtlist[a].x, boughtlist[a].y, true);
		if (b) { offers.push(b); }
	}
	for (a in soldlist) {
		b = readline(soldlist[a].x, soldlist[a].y, false);
		if (b) { offers.push(b); }
	}
	offers.sort(function (a, b) { return b.y - a.y; });

	//== merge the offers with previous ones ==
	var addtime = Date.now();

	c = 0;
	for (a = -1; a < offers.length; a++) {
		var match = true;
		var n = 0;
		for (b = 0; b < offers.length && b < gehist.length; b++) {
			var o1 = offers[offers.length - 1 - b];
			var o2 = gehist[gehist.length - 1 - b + a];
			if (!o1 || !o2) { continue; }
			if (o1.amount != o2.amount) { match = false; break; }
			if (o1.buy != o2.buy) { match = false; break; }
			if (o1.item != o2.item) { match = false; break; }
			if (o1.price != o2.price) { match = false; break; }
			n++;
		}
		if (n > 0 && match && b != 0) { c = offers.length - a; break; }
	}
	importedIndexes = [];
	b = gehist.length - c;
	for (a = 0; a < offers.length; a++) {
		importedIndexes.push(b + a);
		if (a < c) { continue; }
		gehist.push({
			time: addtime,
			buy: offers[a].buy,
			amount: offers[a].amount,
			item: offers[a].item,
			price: offers[a].price,
			id: 0,
			value: 0
		});
	}

	findIds();
	draw();
	saveData();
}

function readItemAmount(img,x,y) {
	var a, b, c,nstr, dx;
	widths = [7, 4, 7, 6, 5, 6, 7, 6, 7, 7, 10, 10];
	amounts = "0,1,2,3,4,5,6,7,8,9,000,000000".split(",");

	nstr = "";
	for (dx = 0; dx < 30;) {
		c = -1;
		for (a in imgnumbers) {
			if (a1lib.simplecompare(img, imgnumbers[a], x + dx, y, 10) !== false) { c = a; break; }
		}
		if (c != -1) {
			nstr += amounts[a];
			dx += widths[a];
			continue;
		}
		break;
	}
	return +nstr;
}

function draw() {
	elid("overview").innerHTML = drawList();
}

function drawList(filter) {
	var a, b, c, str, pitems, offer, t, r;

	pitems = {};

	str = "";
	if (gehist.length != 0) {
		for (a =0; a < gehist.length; a++) {
			offer = gehist[a]
			if (filter && gehist[a].id != filter) { continue; }

			//build row
			t = "";
			t += "<tr class='offerrow " + (importedIndexes.indexOf(a) != -1 ? "newrow" : "") + "' onclick='selectItem(" + gehist[a].id + ");'>";
			t += "<td>" + (gehist[a].buy ? "<div title='Bought' class='boughticon'></div>" : "<div title='Sold' class='soldicon'></div>") + "</td>";
			t += "<td class='right'>" + spacedTrunc(gehist[a].amount) + "</td>";
			t += "<td>" + gehist[a].item + "</td>";
			t += "<td class='right'>" + spacedTrunc(gehist[a].value) + "</td>";
			t += "<td class='right'>" + spacedTrunc(gehist[a].price / gehist[a].amount) + "</td>";
			c=gehist[a].price;
			t += "<td class='right' title='" + spacedTrunc(c) + " gp'>" + spacedTrunc(c / 1000) + "k</td>";

			//calculate subtotals
			if (offer.id != 0) {
				if (!pitems[offer.id]) { pitems[offer.id] = { stock: 0, profit: 0 }; }
				pitems[offer.id].stock += (offer.buy ? 1 : -1) * offer.amount;
				pitems[offer.id].profit += (offer.buy ? -1 : 1) * offer.price;

				t += "<td class='right'>" + spacedTrunc(pitems[offer.id].stock) + "</td>";
				c = pitems[offer.id].profit;
				t += "<td class='right' title='" + spacedTrunc(c) + " gp'>" + spacedTrunc(c / 1000) + "k</td>";
			} else {
				t += "<td></td><td></td>";
			}

			t += "</tr>";
			str = t + str;
		}

		//add zero row which indicates dumping all stock at ge mid
		if (filter && pitems[filter]) {
			b = items[filter].value * pitems[filter].stock;//dump price

			t = "";
			t += "<td><div class='equalicon'></div></td>";
			t += "<td class='right'>" + spacedTrunc(Math.abs(pitems[filter].stock)) + "</td>";
			t += "<td>Dump at GE mid</td>";
			t += "<td class='right'>" + spacedTrunc(items[filter].value) + "</td>";
			t += "<td class='right'>" + spacedTrunc(items[filter].value) + "</td>";
			c = Math.abs(b);
			t += "<td class='right' title='" + spacedTrunc(c) + " gp'>" + spacedTrunc(c / 1000) + "k</td>";
			t += "<td class='right'>0</td>";
			c = pitems[filter].profit + b;
			t += "<td class='right' title='" + spacedTrunc(c) + " gp'>" + spacedTrunc(c / 1000) + "k</td>";
			str = t + str;
		}

		r = "<table class='nistable offertable'>";
		r += "<tr><th></th><th>#</th><th>Item</th><th>GE</th><th>Each</th><th>Price</th><th>Stock</th><th>Profit</th></tr>";
		r += str;
		r += "</table>";
	}
	return r;
}

function selectItem(id) {
	var a, b, c, d;

	elid("singlelist").innerHTML = drawList(id);

	selectTab(1);
}

function reset() {
	gehist = [];
	clearlocalstorage("gehist");
}

function findInfo(name) {
	var a, b, c;
	for (a in items) { if (items[a].name == name) { return [a,items[a]]; } }

	//add to next batch request
	if (itemswaiting.indexOf(name) == -1 && itemsloaded.indexOf(name) == -1) {
		itemswaiting.push(name);
	}

	return false;
}

function loadIds() {
	var a, b, c, d, q;

	if (itemswaiting.length == 0) { return; }
	q = { names: JSON.stringify(itemswaiting) };
	for (a in itemswaiting) { itemsloaded.push(itemswaiting[a]); }
	itemswaiting = [];

	dlpagepost("/apps/ge/getitems.php", q, function (t) {
		var a, b, c;
		try { a = JSON.parse(t); }
		catch (e) { clog("failed to parse item load return json"); return; }

		c = 0;
		for (b in a.items) { if (!items[b]) { items[b] = a.items[b]; c++; } }
		clog("items added", c);
		findIds();
	}, function () { loadingitems = false; clog("failed to download items"); });

}

function findIds() {
	var a, b, c;

	for (a in gehist) {
		b = findInfo(gehist[a].item);
		if (b) {
			gehist[a].id = b[0];
			gehist[a].value = b[1].value;
		}
	}

	loadIds();
	draw();
}

function selectTab(tabnr) {
	currentTab = tabnr;
	elid("main").setAttribute("data-tab", tabnr);
}

function getItemProfit(index) {
	var a, b, c, d;

	for (a = index; a >= 0; a--) {

	}
}

function spacedTrunc(nr) { return spacednr(Math.trunc(nr)); }






