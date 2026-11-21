export type StoreTheme = {
    background: string
    text: string
    mutedText: string
    primary: string
    secondary: string
    surface: string
    border: string
}

// export const betterwareTheme: StoreTheme = {
//     background: 'purple',
//     text: '#ffffff',
//     mutedText: 'rgba(255, 255, 255, 0.8)',
//     primary: '#7F5D99',
//     secondary: '#4C2365',
//     surface: 'rgba(76, 35, 101, 0.78)',
//     border: 'rgba(255, 255, 255, 0.15)',
// }

// export const betterwareTheme: StoreTheme = {
//     background: '#005461',
//     text: '#F4F4F4',
//     mutedText: 'rgba(244, 244, 244, 0.8)',
//     primary: '#00B7B5',
//     secondary: '#018790',
//     surface: 'rgba(0, 84, 97, 0.78)',
//     border: 'rgba(244, 244, 244, 0.15)',
// }

export const betterwareTheme2: StoreTheme2 = {
    background: '#ff66d9',       // El fondo general magenta vibrante que ya tienes atrás
    text: '#1F2937',             // Texto oscuro principal (para "Abraza Igor 2 en 1" y "$549.00")
    mutedText: '#4B5563',        // Texto gris medio (para la descripción, medidas y material)
    primary: '#fff',          // Tu rosa brillante
    secondary: '#ff99e6',        // El magenta intenso del botón "Pedir"
    surface: '#FFFFFF',          // <-- ESTE es el que pinta de BLANCO el bloque de texto de la card
    border: '#E5E7EB',           // Borde gris claro para la línea divisoria encima de los precios
}

export const betterwareTheme: StoreTheme = {
    background: '#06b6d4',       // Azul turquesa vibrante para el fondo general
    text: '#1F2937',             // Texto oscuro principal (títulos, precios y botones sobre blanco)
    mutedText: '#4B5563',        // Texto gris medio (descripción, medidas y material)
    primary: '#fff',             // Blanco limpio para elementos/botones destacados sobre turquesa
    secondary: '#0891b2',        // Turquesa más profundo para hovers, acentos o botón principal
    surface: '#FFFFFF',          // Fondo blanco para el bloque inferior de información de la card
    border: '#E5E7EB',           // Borde gris claro para divisores y contornos sutiles
};
