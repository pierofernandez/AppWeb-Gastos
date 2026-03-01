import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';

export default function TransactionModal({
    isOpen,
    onClose,
    onSave,
    type = 'gasto', // 'gasto' o 'ingreso'
    initialData = null
}) {
    const [monto, setMonto] = useState('');
    const [categoriaId, setCategoriaId] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [metodoPagoId, setMetodoPagoId] = useState('');
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);

    // DB Data
    const [dbCategorias, setDbCategorias] = useState([]);
    const [dbMetodosPago, setDbMetodosPago] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchFormData();
        }
    }, [isOpen, type]);

    const fetchFormData = async () => {
        setIsLoadingData(true);
        try {
            // Fetch Categorias
            const { data: catData } = await supabase
                .from('categorias')
                .select('id, nombre')
                .eq('tipo', type);

            setDbCategorias(catData || []);

            // Fetch Metodos Pago (solo si es gasto)
            if (type === 'gasto') {
                const { data: metData } = await supabase
                    .from('metodos_pago')
                    .select('id, nombre');

                if (metData && metData.length === 0) {
                    const { data: seededData } = await supabase
                        .from('metodos_pago')
                        .insert([
                            { nombre: 'Efectivo' },
                            { nombre: 'Yape' },
                            { nombre: 'Plin' },
                            { nombre: 'Tarjeta' }
                        ])
                        .select();
                    setDbMetodosPago(seededData || []);
                } else {
                    setDbMetodosPago(metData || []);
                }
            }
        } catch (error) {
            console.error("Error fetching modal data:", error);
        } finally {
            setIsLoadingData(false);
        }
    };

    // Cargar datos iniciales si estamos editando
    useEffect(() => {
        if (initialData) {
            setMonto(initialData.monto.toString());
            setCategoriaId(initialData.categoria_id);
            setDescripcion(initialData.descripcion);
            setMetodoPagoId(initialData.metodo_pago_id || '');
            setFecha(initialData.fecha);
        } else {
            resetForm();
        }
    }, [initialData, isOpen]);

    const resetForm = () => {
        setMonto('');
        setCategoriaId('');
        setDescripcion('');
        setMetodoPagoId('');
        setFecha(new Date().toISOString().split('T')[0]);
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (!monto || !categoriaId || !descripcion || !fecha) return;
        if (type === 'gasto' && !metodoPagoId) return;

        const dataToSave = {
            monto: parseFloat(monto),
            categoria_id: categoriaId,
            descripcion,
            metodo_pago_id: type === 'gasto' ? metodoPagoId : null,
            fecha,
            tipo: type
        };

        if (initialData?.id) {
            dataToSave.id = initialData.id;
        }

        onSave(dataToSave);
        resetForm();
        onClose();
    };

    const isGasto = type === 'gasto';

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Editar' : 'Nuevo'} {isGasto ? 'Gasto' : 'Ingreso'}</DialogTitle>
                    <DialogDescription>
                        {initialData ? 'Modifica los detalles de tu registro aquí.' : `Registra un nuevo ${type} en tu historial.`}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSave} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="monto">Monto</Label>
                        <Input
                            id="monto"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={monto}
                            onChange={(e) => setMonto(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="descripcion">Descripción</Label>
                        <Input
                            id="descripcion"
                            placeholder={isGasto ? "Ej. Cena en restaurante" : "Ej. Pago de quincena"}
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Categoría</Label>
                        <Select value={categoriaId} onValueChange={setCategoriaId} required>
                            <SelectTrigger>
                                <SelectValue placeholder={isLoadingData ? "Cargando..." : "Selecciona una categoría"} />
                            </SelectTrigger>
                            <SelectContent>
                                {dbCategorias.length === 0 && !isLoadingData && (
                                    <div className="p-2 text-xs text-muted-foreground text-center">No hay categorías. Créalas primero.</div>
                                )}
                                {dbCategorias.map(cat => (
                                    <SelectItem key={cat.id} value={cat.id}>{cat.nombre}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {isGasto && (
                        <div className="space-y-2">
                            <Label>Método de Pago</Label>
                            <Select value={metodoPagoId} onValueChange={setMetodoPagoId} required>
                                <SelectTrigger>
                                    <SelectValue placeholder={isLoadingData ? "Cargando..." : "Selecciona un método"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {dbMetodosPago.length === 0 && !isLoadingData && (
                                        <div className="p-2 text-xs text-muted-foreground text-center italic">
                                            No se encontraron métodos. <br />
                                            Verifica las políticas de Supabase.
                                        </div>
                                    )}
                                    {dbMetodosPago.map(metodo => (
                                        <SelectItem key={metodo.id} value={metodo.id}>{metodo.nombre}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="fecha">Fecha</Label>
                        <Input
                            id="fecha"
                            type="date"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            required
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button type="submit">Guardar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
