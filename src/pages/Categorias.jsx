import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, ShoppingCart, Briefcase, Car, Film, Home, Coffee, Smartphone, Plane, Activity, Heart, Zap, Music, Book, Gift, Scissors, Droplet, HelpCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import CategoriaModal from '../components/transactions/CategoriaModal';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const ICONS_MAP = {
    ShoppingCart, Briefcase, Car, Film, Home, Coffee, Smartphone, Plane,
    Activity, Heart, Zap, Music, Book, Gift, Scissors, Droplet
};

export default function Categorias() {
    const { user } = useAuth();
    const [categorias, setCategorias] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategoria, setEditingCategoria] = useState(null);
    const { toast } = useToast();

    const fetchCategorias = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('categorias')
            .select('*')
            .order('creado_en', { ascending: false });

        if (error) {
            toast({ title: "Error al cargar categorías", description: error.message, variant: "destructive" });
        } else {
            setCategorias(data || []);
        }
        setIsLoading(false);
    }, [toast]);

    useEffect(() => {
        fetchCategorias();
    }, [fetchCategorias]);

    const handleOpenModal = (cat = null) => {
        setEditingCategoria(cat);
        setIsModalOpen(true);
    };

    const handleSaveCategoria = async (categoriaData) => {
        try {
            if (editingCategoria) {
                const { error } = await supabase
                    .from('categorias')
                    .update({
                        nombre: categoriaData.nombre,
                        tipo: categoriaData.tipo,
                        // Sugerencia: El usuario debería añadir 'color' e 'icono' a su tabla
                        color: categoriaData.color,
                        icono: categoriaData.icono
                    })
                    .eq('id', categoriaData.id);

                if (error) throw error;
                toast({ title: "Categoría actualizada", description: "Los cambios se guardaron correctamente en la base de datos." });
            } else {
                const { error } = await supabase
                    .from('categorias')
                    .insert([{
                        nombre: categoriaData.nombre,
                        tipo: categoriaData.tipo,
                        usuario_id: user.id,
                        color: categoriaData.color,
                        icono: categoriaData.icono
                    }]);

                if (error) throw error;
                toast({ title: "Categoría creada", description: "La nueva categoría ya está guardada en la base de datos." });
            }
            fetchCategorias();
        } catch (error) {
            toast({
                title: "Error al guardar",
                description: error.message + ". ¿Añadiste las columnas 'color' e 'icono' a la tabla?",
                variant: "destructive"
            });
        }
    };

    const handleDelete = async (id) => {
        const { error } = await supabase
            .from('categorias')
            .delete()
            .eq('id', id);

        if (error) {
            toast({ title: "Error al eliminar", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Categoría eliminada", variant: "destructive", description: "La categoría ha sido eliminada permanentemente." });
            fetchCategorias();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-center sm:text-left">Categorías</h1>
                    <p className="text-muted-foreground mt-1 text-center sm:text-left">Personaliza cómo agrupas tus movimientos.</p>
                </div>
                {isLoading ? (
                    <Skeleton className="h-10 w-full sm:w-[140px]" />
                ) : (
                    <Button onClick={() => handleOpenModal()} className="w-full sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" /> Nueva Categoría
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {isLoading ? (
                    [...Array(4)].map((_, i) => (
                        <Card key={i} className="relative overflow-hidden">
                            <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center text-center space-y-4">
                                <Skeleton className="h-12 w-12 sm:h-16 sm:w-16 rounded-full" />
                                <div className="space-y-2 w-full">
                                    <Skeleton className="h-4 w-3/4 mx-auto" />
                                    <Skeleton className="h-3 w-1/2 mx-auto" />
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    categorias.map(categoria => {
                        const IconComponent = ICONS_MAP[categoria.icono] || HelpCircle;

                        return (
                            <Card key={categoria.id} className="relative overflow-hidden group hover:shadow-md transition-shadow">
                                {/* Barra de color lateral/superior decorativa */}
                                <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: categoria.color }} />

                                <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center text-center space-y-3 sm:space-y-4">
                                    <div
                                        className="p-3 sm:p-4 rounded-full"
                                        style={{ backgroundColor: `${categoria.color}20`, color: categoria.color }}
                                    >
                                        <IconComponent className="h-6 w-6 sm:h-8 sm:w-8" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-semibold text-sm sm:text-lg truncate max-w-[120px] sm:max-w-none">{categoria.nombre}</h3>
                                        <div className="flex flex-col items-center gap-1 mt-0.5">
                                            <span className={`text-[9px] sm:text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${categoria.tipo === 'ingreso' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                                                }`}>
                                                {categoria.tipo}
                                            </span>
                                            <div className="hidden sm:flex items-center justify-center gap-2 mt-1">
                                                <span
                                                    className="inline-block w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: categoria.color }}
                                                />
                                                <span className="text-[10px] text-muted-foreground uppercase">{categoria.color}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botones de acción: siempre visibles en mobile, hover en desktop */}
                                    <div className="absolute top-1 right-1 flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 text-primary bg-background/80 backdrop-blur-sm shadow-sm" onClick={() => handleOpenModal(categoria)}>
                                            <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 text-destructive bg-background/80 backdrop-blur-sm shadow-sm" onClick={() => handleDelete(categoria.id)}>
                                            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>

            {isModalOpen && (
                <CategoriaModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveCategoria}
                    initialData={editingCategoria}
                />
            )}
        </div>
    );
}
