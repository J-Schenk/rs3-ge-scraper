// A conceptual script.js

// 1. Initial Check
if (window.alt1 === undefined) {
    document.getElementById("log").innerHTML = "<span class='error'>Alt1 not detected. Please run this in the Alt1 browser.</span>";
}

// 2. Define the Region to Read
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

function log(message, isError = false) {
    const logElement = document.getElementById("log");
    const span = document.createElement("span");
    span.className = isError ? 'error' : 'success';
    span.innerText = `[${new Date().toLocaleTimeString()}] ${message}`;
    logElement.appendChild(span);
    logElement.appendChild(document.createElement("br"));
    logElement.scrollTop = logElement.scrollHeight; // Auto-scroll
}

function startScrape() {
    log("Starting screen scrape...");

    // FIX APPLIED HERE: Using alt1.capture(null) to bypass the 
    // getRunescapeClientWindow() bug in custom apps.
    const image = alt1.capture(null); 
    
    if (!image) {
        log("Could not capture screen. Check Alt1 permissions/capture settings.", true);
        return;
    }

    // Now, we use the captured image to find the specific area for the GE table.
    // The image object has the coordinates of the captured screen region.
    
    // We assume the RuneScape client is visible within the captured image.
    // We add the client window's offset to the local GE coordinates.
    const clientWindow = alt1.getRunescapeClientWindow();
    const table_x = clientWindow.x + GE_SALE_HISTORY_REGION.x;
    const table_y = clientWindow.y + GE_SALE_HISTORY_REGION.y;

    const rowHeight = 28; // Estimate the pixel height of one row
    const maxRows = 10; // The max number of trades visible
    let scrapedData = [];
    
    document.getElementById("outputTable").getElementsByTagName('tbody')[0].innerHTML = "";

    // Loop through each row of the Sale History table
    for (let i = 0; i < maxRows; i++) {
        const current_y = table_y + (i * rowHeight);

        // Define column offsets (Approximate based on 100% scaling)
        const itemX = table_x + 10;
        const quantityX = table_x + 200;
        const priceX = table_x + 310;
        const textY = current_y + 8; // Adjust to align with text baseline

        // 1. Item Name
        // Note: The capture handle is necessary for bindReadString
        const itemName = alt1.bindReadString(image.handle, RS_FONT_NAME, itemX, textY);
        
        // 2. Quantity
        const quantityText = alt1.bindReadString(image.handle, RS_FONT_NAME, quantityX, textY);
        
        // 3. Price
        const priceText = alt1.bindReadString(image.handle, RS_FONT_NAME, priceX, textY);

        if (itemName.text && itemName.text.trim().length > 0) {
            // 4. Parsing and Cleanup
            const cleanQuantity = parseValue(quantityText.text);
            const cleanPrice = parseValue(priceText.text);

            scrapedData.push({
                item: itemName.text.trim(),
                quantity: cleanQuantity,
                price: cleanPrice
            });
            
            appendDataToTable(itemName.text.trim(), cleanQuantity, cleanPrice);
        } else if (i === 0) {
            log("GE History table not found at expected location (no data on first row).", true);
            break;
        }
    }
    
    alt1.release(image.handle);

    if (scrapedData.length > 0) {
        log(`Successfully scraped ${scrapedData.length} sale history entries.`);
    } else {
         log("No data was scraped.", true);
    }
}

// Helper function to convert '10k', '5.5m' strings to numbers
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
