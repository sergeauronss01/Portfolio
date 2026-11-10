// Select the root element (<html>)
const rootElement = document.documentElement;

/**
 * Toggles the theme between 'light' and 'dark'
 */
const toggleTheme = () => {
    const currentTheme = rootElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    rootElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
};

/**
 * Initialize theme on page load based on storage or system preference
 */
const initTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    const initialTheme = savedTheme || (systemPrefersLight ? 'light' : 'dark');
    
    if (initialTheme === 'light') {
        rootElement.setAttribute('data-theme', 'light');
    } else {
        rootElement.removeAttribute('data-theme'); // Falls back to CSS default (Dark)
    }
};

// Run initialization
document.addEventListener('DOMContentLoaded', initTheme);

// Expose toggleTheme to the window so HTML 'onclick' can find it
window.toggleTheme = toggleTheme;