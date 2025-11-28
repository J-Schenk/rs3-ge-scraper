var alt1 = {
    // Basic screen reading functions (these are injected by the alt1 browser)
    capture: function() { return null; },
    getRunescapeClientWindow: function() { return { x: 0, y: 0, width: 0, height: 0 }; },
    bindReadString: function() { return { text: "", bounds: { x: 0, y: 0, width: 0, height: 0 } }; },
    release: function() { },
    getAlt1Version: function() { return "0.0.0 (simulated)"; },

    // Tools for colors and utility
    tools: {
        ColortoRgb: function(color) {
            // Converts RS color format (AABBGGRR) to HTML RGB (RRGGBB)
            let r = (color & 0xFF);
            let g = (color >> 8) & 0xFF;
            let b = (color >> 16) & 0xFF;
            let a = (color >> 24) & 0xFF;
            return { r: r, g: g, b: b, a: a };
        }
    },

    // A flag to check if the app is running in the Alt1 environment
    alt1: true,

    // Placeholder for when running outside Alt1
    permissions: {}
};

// Check if we are actually running inside alt1 and let it inject its real functions
if (window.alt1 && window.alt1.isAlt1) {
    alt1 = window.alt1;
}

// Ensure the alt1 object is globally available for your script.js to check
window.alt1 = alt1;
