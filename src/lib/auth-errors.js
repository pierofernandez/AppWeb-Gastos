/**
 * Utility to translate Supabase Auth error messages and other technical errors to Spanish.
 */

const errorMessages = {
    // Auth Errors
    'Invalid login credentials': 'Credenciales de inicio de sesión no válidas.',
    'Email not confirmed': 'El correo electrónico no ha sido confirmado.',
    'User not found': 'Usuario no encontrado.',
    'Password is too short': 'La contraseña es demasiado corta (mínimo 6 caracteres).',
    'Email already registered': 'Este correo electrónico ya está registrado.',
    'Invalid email': 'El formato del correo electrónico no es válido.',
    'rate limit exceeded': 'Has excedido el límite de intentos. Por favor, espera unos minutos.',
    'User already registered': 'Este usuario ya está registrado.',
    'Database error saving new user': 'Error en la base de datos al guardar el usuario.',
    'Invalid Refresh Token': 'La sesión ha expirado. Por favor, inicia sesión de nuevo.',
    'Invalid Refresh Token: Refresh Token Not Found': 'La sesión ha expirado.',
    'Signup confirms not allowed for this project': 'El registro no está permitido para este proyecto.',
    'Email rate limit exceeded': 'Se ha excedido el límite de correos. Reintenta en unos minutos.',

    // Recovery/Reset
    'New password should be different from the old password': 'La nueva contraseña debe ser diferente a la anterior.',

    // Generic
    'Network request failed': 'Error de red. Verifica tu conexión.',
};

/**
 * Translates an error message or error object from Supabase/API to Spanish.
 * @param {string|Error|Object} error The error to translate
 * @returns {string} Translated message
 */
export const translateError = (error) => {
    if (!error) return 'Ha ocurrido un error inesperado.';

    const message = typeof error === 'string'
        ? error
        : error.message || error.error_description || 'Ha ocurrido un error inesperado.';

    // Try to find an exact match or a substring match
    const translated = errorMessages[message] ||
        Object.keys(errorMessages).find(key => message.toLowerCase().includes(key.toLowerCase()))
        ? errorMessages[Object.keys(errorMessages).find(key => message.toLowerCase().includes(key.toLowerCase()))]
        : null;

    if (translated) return translated;

    // Fallback translations for specific keywords
    if (message.includes('rate limit')) return errorMessages['rate limit exceeded'];
    if (message.includes('credentials')) return errorMessages['Invalid login credentials'];
    if (message.includes('confirmed')) return errorMessages['Email not confirmed'];
    if (message.includes('already registered')) return errorMessages['Email already registered'];

    return message; // Return original if no translation found
};
