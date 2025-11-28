// A conceptual script.js

// 1. Define the Region to Read
// *** THESE ARE PLACEHOLDER COORDINATES ***
// You MUST adjust these values based on your RuneScape client size and interface position.
// Use Alt1's debug tools to find the top-left corner (x, y) of the Sale History table.
const GE_SALE_HISTORY_REGION = {
    x: 100, // Top-left X coordinate of the table (relative to RS client)
    y: 100, // Top-left Y coordinate of the table (relative to RS client)
    w: 400, // Width (Total table width)
    h: 300  // Height (Total table height)
};

// Assuming the RuneScape chat font is the correct font for the GE text.
const RS_FONT_NAME = 'chat'; 

// --- Logging Functions ---

function log(message, isError = false) {
    const logElement = document.getElementById("log");
    const span = document.createElement("span");
    span.className = isError ? 'error' : 'success';
    span.innerText = `[${new Date().toLocaleTimeString()}] ${message}`;
    logElement.appendChild(span);
    logElement.appendChild(document.createElement("br"));
    logElement.scrollTop = logElement.scrollHeight; // Auto-scroll
}

// --- Alt1 Viability Check (Key Improvement) ---

function checkViability() {
    // 1. Check if Alt1 itself is loaded (from alt1api.js)
    if (window.alt1 === undefined || !window.alt1.alt1) {
        return "Alt1 not detected. Please run this in the Alt1 browser.";
    }
    
    // 2. Check if Alt1's internal capture hook is working
    // This is the flag that often fails if the user's Alt1 settings are wrong (e.g., wrong capture mode)
    if (!alt1.captureIsWorking) {
        return "Alt1 capture is not working. Check Alt1 settings > Capture tab to ensure OpenGL/DirectX is selected and working.";
    }

    // 3. Check if a Runescape client window is currently detected
    const clientWindow = alt1.getRunescapeClientWindow();
    if (!clientWindow || clientWindow.width === 0 || clientWindow.height === 0) {
        return "Could not find RuneScape window. Is the client open and focused?";
    }
    
    return null; // Viable
}


// --- Main Scrape Function ---

function startScrape() {
    // 1. Run the robust viability check first
    const viabilityError = checkViability();
    if (viabilityError) {
        log(viabilityError, true);
        return;
    }
    
    log("Starting screen scrape... (Alt1 capture status OK)");

    // 2. Capture the entire screen (the reliable method)
    const image = alt1.capture(null); 
    
    // 3. Check if the image object or its handle is invalid after capture
    if (!image || !image.handle || image.handle === 0) { 
        log("Capture failed. Is the RuneScape client fully visible and not covered by other windows/overlays?", true);
        return;
    }
    
    const clientWindow = alt1.getRunescapeClientWindow();
    const table_x = clientWindow.x + GE_SALE_HISTORY_REGION.x;
    const table_y = clientWindow.y + GE_SALE_HISTORY_REGION.y;

    const rowHeight = 28; 
    const maxRows = 10; 
    let scrapedData = [];
    
    document.getElementById("outputTable").getElementsByTagName('tbody')[0].innerHTML = "";

    // 4. Loop and Read Pixels
    for (let i = 0; i < maxRows; i++) {
        const current_y = table_y + (i * rowHeight);

        // Define column offsets 
        const itemX = table_x + 10;
        const quantityX = table_x + 200;
        const priceX = table_x + 310;
        const textY = current_y + 8; 

        // Read text using the image handle
        const itemName = alt1.bindReadString(image.handle, RS_FONT_NAME, itemX, textY);
        const quantityText = alt1.bindReadString(image.handle, RS_FONT_NAME, quantityX, textY);
        const priceText = alt1.bindReadString(image.handle, RS_FONT_NAME, priceX, textY);

        if (itemName.text && itemName.text.trim().length > 0) {
            // Parsing and Cleanup
            const cleanQuantity = parseValue(quantityText.text);
            const cleanPrice = parseValue(priceText.text);

            scrapedData.push({
                item: itemName.text.trim(),
                quantity: cleanQuantity,
                price: cleanPrice
            });
            
            appendDataToTable(itemName.text.trim(), cleanQuantity, cleanPrice);
        } else if (i === 0) {
            log("GE History table not found at expected location (no data on first row). Check X/Y coordinates.", true);
            break;
        }
    }
    
    // 5. Cleanup
    alt1.release(image.handle);

    if (scrapedData.length > 0) {
        log(`Successfully scraped ${scrapedData.length} sale history entries.`, false);
    } else if (viabilityError === null) {
         log("No data was scraped. Check if the GE Sale History tab is open and the coordinates in script.js are correct.", true);
    }
}

// --- Helper Functions ---

function parseValue(value) {
    if (!value) return 0;
    let clean = value.replace(/,/g, '').toLowerCase().trim();
    let multiplier = 1;

    if (clean.endsWith('k')) {
        multiplier = 1000;
        clean = clean.slice(0, -1);
    } else if (clean.endsWith('m')) {
        multiplier = 1000000;
        clean = clean.slice(0, -1);
    } else if (clean.endsWith('b')) {
        multiplier = 1000000000;
        clean = clean.slice(0, -1);
    }

    const num = parseFloat(clean);
    return isNaN(num) ? 0 : Math.round(num * multiplier);
}

function appendDataToTable(item, quantity, price) {
    const tableBody = document.getElementById("outputTable").getElementsByTagName('tbody')[0];
    const newRow = tableBody.insertRow();
    
    newRow.insertCell().innerText = item;
    newRow.insertCell().innerText = quantity.toLocaleString();
    newRow.insertCell().innerText = price.toLocaleString();
}
