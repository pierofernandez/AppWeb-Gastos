export const mockData = {
    resumen: {
        totalIngresos: 4500.00,
        totalGastos: 2350.50,
        balance: 2149.50,
    },
    gastosPorCategoria: [
        { name: 'Alimentación', value: 850.20, color: '#ef4444' }, // Red
        { name: 'Transporte', value: 340.00, color: '#f97316' },   // Orange
        { name: 'Vivienda', value: 750.00, color: '#3b82f6' },     // Blue
        { name: 'Entretenimiento', value: 210.30, color: '#8b5cf6' },// Purple
        { name: 'Otros', value: 200.00, color: '#64748b' },        // Slate
    ],
    ultimosMovimientos: [
        { id: 1, tipo: 'gasto', categoria: 'Alimentación', descripcion: 'Compra Supermercado', monto: 120.50, fecha: '2023-10-25', icon: 'shopping-cart' },
        { id: 2, tipo: 'ingreso', categoria: 'Salario', descripcion: 'Pago Quincena', monto: 2250.00, fecha: '2023-10-24', icon: 'briefcase' },
        { id: 3, tipo: 'gasto', categoria: 'Transporte', descripcion: 'Gasolina', monto: 45.00, fecha: '2023-10-22', icon: 'car' },
        { id: 4, tipo: 'gasto', categoria: 'Entretenimiento', descripcion: 'Suscripción Netflix', monto: 15.99, fecha: '2023-10-21', icon: 'film' },
        { id: 5, tipo: 'gasto', categoria: 'Vivienda', descripcion: 'Pago Luz', monto: 65.00, fecha: '2023-10-20', icon: 'home' },
    ]
};
