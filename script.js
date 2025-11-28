// A conceptual script.js

// 1. Initial Check
if (window.alt1 === undefined) {
    document.getElementById("log").innerHTML = "<span class='error'>Alt1 not detected. Please run this in the Alt1 browser.</span>";
}

// 2. Define the Region to Read
// These values are placeholders! You MUST determine the exact screen coordinates 
// (x, y, width, height) of the Sale History table based on your RuneScape interface setup.
// Use Alt1's debug/dev tools (Alt+3 menu -> right-click spanner -> developer console)
// and the Color/Coordinate Picker to get these.

// The Sale History table area relative to the RS client window:
const GE_SALE_HISTORY_REGION = {
    x: 100, // Example: X coordinate of the table start
    y: 100, // Example: Y coordinate of the table start
    w: 400, // Example: Width of the table
    h: 300  // Example: Height of the table (to cover ~10 entries)
};

// Assuming the RuneScape chat font is the correct font for the GE text.
const RS_FONT_NAME = 'chat'; 
// Find the color of the text in the GE table (e.g., white or a light grey)
const TEXT_COLOR = alt1.tools.ColortoRgb(0xFFFFFF); // Example: White (RRGGBB)

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

    // Bind the region of the entire RuneScape window for pixel/text access
    // This allows fast operations on the captured image.
    const image = alt1.capture(alt1.getRunescapeClientWindow()); 
    if (!image) {
        log("Could not capture RuneScape window. Is the client open?", true);
        return;
    }

    // You must now find the location of the GE Sale History tab relative to the *capture*.
    // The GE window location changes based on interface scaling and position.

    // A robust app would use alt1.findImage() to locate a known static image 
    // (like the 'Sale History' tab icon) to anchor the scraping region.

    // --- CONCEPTUAL/SIMPLIFIED LOCATION (Requires Manual Setup) ---
    // If you set your RS client to fixed positions, you can use fixed coordinates.
    // However, finding the GE interface dynamically is necessary for a user-friendly app.
    
    // For this example, we assume we have a fixed starting point for the top-left of the table
    const table_x = image.x + GE_SALE_HISTORY_REGION.x;
    const table_y = image.y + GE_SALE_HISTORY_REGION.y;

    const rowHeight = 28; // Estimate the pixel height of one row
    const maxRows = 10; // The max number of trades visible
    let scrapedData = [];
    
    // Clear old data
    document.getElementById("outputTable").getElementsByTagName('tbody')[0].innerHTML = "";

    // Loop through each row of the Sale History table
    for (let i = 0; i < maxRows; i++) {
        const current_y = table_y + (i * rowHeight);

        // --- CONCEPTUAL READ REGIONS FOR ONE ROW ---
        // These widths are highly dependent on the font and column layout.
        
        // 1. Item Name (e.g., first 180 pixels)
        const itemName = alt1.bindReadString(image.handle, RS_FONT_NAME, table_x + 10, current_y + 8);
        
        // 2. Quantity (e.g., next 100 pixels)
        const quantityText = alt1.bindReadString(image.handle, RS_FONT_NAME, table_x + 200, current_y + 8);
        
        // 3. Price (e.g., last 100 pixels)
        const priceText = alt1.bindReadString(image.handle, RS_FONT_NAME, table_x + 310, current_y + 8);

        // Simple check to ensure we read something
        if (itemName.text && itemName.text.trim().length > 0) {
            // 4. Parsing and Cleanup
            // Remove k/m/b, commas, and white space from quantity/price
            const cleanQuantity = parseValue(quantityText.text);
            const cleanPrice = parseValue(priceText.text);

            scrapedData.push({
                item: itemName.text.trim(),
                quantity: cleanQuantity,
                price: cleanPrice
            });
            
            // Add to the HTML table
            appendDataToTable(itemName.text.trim(), cleanQuantity, cleanPrice);
        } else if (i === 0) {
            // If the first row is empty, the table might not be visible
            log("GE History table not found at expected location.", true);
            break;
        }
    }
    
    // Release the bound image handle
    alt1.release(image.handle);

    if (scrapedData.length > 0) {
        log(`Successfully scraped ${scrapedData.length} sale history entries.`);
        console.log(scrapedData); // Log to developer console for debugging
    } else {
         log("No data was scraped. Check coordinates/visibility.", true);
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
