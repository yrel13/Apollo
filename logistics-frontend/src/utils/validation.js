// Form validation utilities
export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const validatePassword = (password) => {
    return password.length >= 6;
};

export const validateUsername = (username) => {
    return username.trim().length >= 3;
};

export const validateRequired = (value) => {
    return value && value.trim().length > 0;
};

export const validateInventoryForm = (form) => {
    const errors = {};
    if (!validateRequired(form.name)) errors.name = 'Product name is required';
    if (!validateRequired(form.sku)) errors.sku = 'SKU is required';
    if (!form.quantity || form.quantity < 0) errors.quantity = 'Quantity must be >= 0';
    if (!form.price || form.price < 0) errors.price = 'Price must be >= 0';
    return errors;
};

export const validateUserForm = (form) => {
    const errors = {};
    if (!validateUsername(form.username)) errors.username = 'Username must be at least 3 characters';
    if (!validateEmail(form.email)) errors.email = 'Invalid email address';
    if (!form.password && !form.id) errors.password = 'Password is required for new users';
    if (form.password && !validatePassword(form.password)) errors.password = 'Password must be at least 6 characters';
    return errors;
};

export const validateShipmentForm = (form) => {
    const errors = {};
    if (!validateRequired(form.orderNumber)) errors.orderNumber = 'Order number is required';
    if (!validateRequired(form.destination)) errors.destination = 'Destination is required';
    return errors;
};
