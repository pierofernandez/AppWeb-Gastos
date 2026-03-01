import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { ShoppingCart, Briefcase, Car, Film, Home, Coffee, Smartphone, Plane, Activity, Heart, Zap, Music, Book, Gift, Scissors, Droplet } from 'lucide-react';

const ICONS = {
    ShoppingCart, Briefcase, Car, Film, Home, Coffee, Smartphone, Plane,
    Activity, Heart, Zap, Music, Book, Gift, Scissors, Droplet
};

const PREDEFINED_COLORS = [
    '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#06b6d4',
    '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e', '#64748b', '#000000'
];

export default function CategoriaModal({
    isOpen,
    onClose,
    onSave,
    initialData = null
}) {
    const [nombre, setNombre] = useState('');
    const [color, setColor] = useState('#3b82f6');
    const [icono, setIcono] = useState('Home');
    const [tipo, setTipo] = useState('gasto');

    useEffect(() => {
        if (initialData) {
            setNombre(initialData.nombre);
            setColor(initialData.color || '#3b82f6');
            setIcono(initialData.icono || 'Home');
            setTipo(initialData.tipo || 'gasto');
        } else {
            resetForm();
        }
    }, [initialData, isOpen]);

    const resetForm = () => {
        setNombre('');
        setColor('#3b82f6');
        setIcono('Home');
        setTipo('gasto');
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (!nombre || !color || !icono || !tipo) return;

        onSave({
            id: initialData?.id,
            nombre,
            color,
            icono,
            tipo
        });

        resetForm();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[95vw] sm:max-w-[425px] p-4 sm:p-6 overflow-hidden max-h-[90vh] flex flex-col">
                <DialogHeader className="pb-2">
                    <DialogTitle className="text-xl sm:text-2xl">{initialData ? 'Editar Categoría' : 'Nueva Categoría'}</DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm">
                        Personaliza el nombre, color e ícono de esta categoría.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSave} className="space-y-4 sm:space-y-6 flex-1 overflow-y-auto pr-1">
                    <div className="space-y-1.5 sm:space-y-2">
                        <Label htmlFor="nombre" className="text-xs sm:text-sm">Nombre</Label>
                        <Input
                            id="nombre"
                            placeholder="Ej. Restaurantes"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            className="h-9 sm:h-10 text-sm"
                        />
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                        <Label className="text-xs sm:text-sm">Tipo</Label>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant={tipo === 'gasto' ? 'default' : 'outline'}
                                className="flex-1 h-8 sm:h-9 text-xs sm:text-sm"
                                onClick={() => setTipo('gasto')}
                            >
                                Gasto
                            </Button>
                            <Button
                                type="button"
                                variant={tipo === 'ingreso' ? 'default' : 'outline'}
                                className="flex-1 h-8 sm:h-9 text-xs sm:text-sm"
                                onClick={() => setTipo('ingreso')}
                            >
                                Ingreso
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs sm:text-sm">Color</Label>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {PREDEFINED_COLORS.map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setColor(c)}
                                    className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full border-2 transition-all ${color === c ? 'border-foreground scale-110' : 'border-transparent'}`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                            <div className="relative h-7 w-7 sm:h-8 sm:w-8 overflow-hidden rounded-full border border-border">
                                <Input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="absolute -top-2 -left-2 h-10 w-10 sm:h-12 sm:w-12 cursor-pointer border-0 p-0"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs sm:text-sm">Ícono</Label>
                        <div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5 sm:gap-2">
                            {Object.keys(ICONS).map(iconName => {
                                const IconComponent = ICONS[iconName];
                                const isSelected = icono === iconName;
                                return (
                                    <button
                                        key={iconName}
                                        type="button"
                                        onClick={() => setIcono(iconName)}
                                        className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-md border transition-all ${isSelected ? 'border-foreground bg-primary/10 text-primary' : 'bg-transparent text-muted-foreground hover:bg-muted'
                                            }`}
                                    >
                                        <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <DialogFooter className="pt-2 sm:pt-4 gap-2">
                        <Button type="button" variant="outline" onClick={onClose} className="h-9 sm:h-10 text-xs sm:text-sm">Cancelar</Button>
                        <Button type="submit" className="h-9 sm:h-10 text-xs sm:text-sm">Guardar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
