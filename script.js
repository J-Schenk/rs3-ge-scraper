// A conceptual script.js

// ... (rest of the file remains the same) ...

function startScrape() {
    log("Starting screen scrape...");

    // Using the fixed capture call:
    const image = alt1.capture(null); 
    
    // Check if the image object or its handle is invalid
    if (!image || !image.handle || image.handle === 0) { 
        // This is the false-positive error message that Alt1 uses.
        log("Capture failed. Ensure Runescape is open and Alt1 has screen permission.", true);
        return;
    }

    // Now, we proceed with the assumption that the capture succeeded.
    // ... (Use clientWindow as before)
    const clientWindow = alt1.getRunescapeClientWindow();
    const table_x = clientWindow.x + GE_SALE_HISTORY_REGION.x;
    const table_y = clientWindow.y + GE_SALE_HISTORY_REGION.y;

    const rowHeight = 28; 
    const maxRows = 10; 
    let scrapedData = [];
    
    document.getElementById("outputTable").getElementsByTagName('tbody')[0].innerHTML = "";

    // Loop through each row of the Sale History table
    for (let i = 0; i < maxRows; i++) {
        const current_y = table_y + (i * rowHeight);

        // ... (Define text coordinates as before)
        const itemX = table_x + 10;
        const quantityX = table_x + 200;
        const priceX = table_x + 310;
        const textY = current_y + 8; 

        // 1. Item Name - Uses the VALIDATED image.handle
        const itemName = alt1.bindReadString(image.handle, RS_FONT_NAME, itemX, textY);
        
        // 2. Quantity
        const quantityText = alt1.bindReadString(image.handle, RS_FONT_NAME, quantityX, textY);
        
        // 3. Price
        const priceText = alt1.bindReadString(image.handle, RS_FONT_NAME, priceX, textY);

        if (itemName.text && itemName.text.trim().length > 0) {
            // ... (rest of the code to parse and display) ...
            const cleanQuantity = parseValue(quantityText.text);
            const cleanPrice = parseValue(priceText.text);

            scrapedData.push({
                item: itemName.text.trim(),
                quantity: cleanQuantity,
                price: cleanPrice
            });
            
            appendDataToTable(itemName.text.trim(), cleanQuantity, cleanPrice);
        } else if (i === 0) {
            log("GE History table not found at expected location (no data on first row). Check X/Y coordinates in script.js.", true);
            break;
        }
    }
    
    // Always release the handle when done
    alt1.release(image.handle);

    if (scrapedData.length > 0) {
        log(`Successfully scraped ${scrapedData.length} sale history entries.`);
    } else {
         log("No data was scraped.", true);
    }
}

// ... (rest of helper functions remain the same) ...
