// Simple toast notification utility
const toastContainer = () => {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed top-4 right-4 z-50 space-y-2';
        document.body.appendChild(container);
    }
    return container;
};

export const showToast = (message, type = 'info', duration = 3000) => {
    const container = toastContainer();
    const toast = document.createElement('div');
    
    const bgColor = {
        'success': 'bg-green-500',
        'error': 'bg-red-500',
        'info': 'bg-blue-500',
        'warning': 'bg-yellow-500',
    }[type] || 'bg-blue-500';
    
    toast.className = `${bgColor} text-white px-4 py-3 rounded-lg shadow-lg animate-slideIn`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, duration);
};
