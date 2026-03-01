import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Skeleton } from '../components/ui/skeleton';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../components/ui/popover";
import { Calendar } from "../components/ui/calendar";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "../components/ui/pagination";
import TransactionModal from '../components/transactions/TransactionModal';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { format, isWithinInterval, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from "../lib/utils";
import { Calendar as CalendarIcon } from 'lucide-react';

export default function Ingresos() {
    const { user } = useAuth();
    const [ingresos, setIngresos] = useState([]);
    const [filteredIngresos, setFilteredIngresos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIngreso, setEditingIngreso] = useState(null);
    const [date, setDate] = useState(undefined);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const { toast } = useToast();

    const fetchIngresos = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('movimientos')
            .select(`
                *,
                categorias(nombre)
            `)
            .eq('tipo', 'ingreso')
            .order('fecha', { ascending: false });

        if (error) {
            toast({ title: "Error al cargar ingresos", description: error.message, variant: "destructive" });
        } else {
            setIngresos(data || []);
        }
        setIsLoading(false);
    }, [toast]);

    useEffect(() => {
        fetchIngresos();
    }, [fetchIngresos]);

    useEffect(() => {
        if (!ingresos.length) {
            setFilteredIngresos([]);
            return;
        }

        // Si no hay fecha seleccionada, mostrar todo
        if (!date || !date.from || !date.to) {
            setFilteredIngresos(ingresos);
            setCurrentPage(1);
            return;
        }

        const filtered = ingresos.filter(i => {
            const iDate = parseISO(i.fecha);
            return isWithinInterval(iDate, { start: date.from, end: date.to });
        });
        setFilteredIngresos(filtered);
        setCurrentPage(1);
    }, [ingresos, date]);

    const handleOpenModal = (ingreso = null) => {
        setEditingIngreso(ingreso);
        setIsModalOpen(true);
    };

    const handleSaveIngreso = async (ingresoData) => {
        try {
            if (editingIngreso) {
                const { error } = await supabase
                    .from('movimientos')
                    .update({
                        monto: ingresoData.monto,
                        categoria_id: ingresoData.categoria_id,
                        descripcion: ingresoData.descripcion,
                        fecha: ingresoData.fecha
                    })
                    .eq('id', editingIngreso.id);

                if (error) throw error;
                toast({ title: "Ingreso actualizado", description: "El registro ha sido modificado en la base de datos." });
            } else {
                const { error } = await supabase
                    .from('movimientos')
                    .insert([{
                        ...ingresoData,
                        usuario_id: user.id
                    }]);

                if (error) throw error;
                toast({ title: "Ingreso registrado", description: "El nuevo ingreso ha sido guardado exitosamente." });
            }
            fetchIngresos();
        } catch (error) {
            toast({ title: "Error al guardar", description: error.message, variant: "destructive" });
        }
    };

    const handleDelete = async (id) => {
        const { error } = await supabase
            .from('movimientos')
            .delete()
            .eq('id', id);

        if (error) {
            toast({ title: "Error al eliminar", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Ingreso eliminado", variant: "destructive", description: "El registro ha sido borrado de tu historial." });
            fetchIngresos();
        }
    };

    const totalIngresos = filteredIngresos.reduce((acc, curr) => acc + parseFloat(curr.monto), 0);

    const totalPages = Math.ceil(filteredIngresos.length / itemsPerPage);
    const paginatedItems = filteredIngresos.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-center lg:text-left">Ingresos</h1>
                    <p className="text-muted-foreground mt-1 text-center lg:text-left">Lleva el control de todo el dinero que entra.</p>
                </div>
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2 w-full lg:w-auto">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full lg:w-[240px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date?.from ? (
                                    date.to ? (
                                        <>
                                            {format(date.from, "dd LLL", { locale: es })} -{" "}
                                            {format(date.to, "dd LLL", { locale: es })}
                                        </>
                                    ) : (
                                        format(date.from, "LLL dd, y")
                                    )
                                ) : (
                                    <span>Seleccionar fechas</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={2}
                                locale={es}
                            />
                        </PopoverContent>
                    </Popover>

                    {isLoading ? (
                        <Skeleton className="h-10 w-full lg:w-[140px]" />
                    ) : (
                        <Button onClick={() => handleOpenModal()} className="w-full lg:w-auto bg-emerald-600 hover:bg-emerald-700">
                            <Plus className="mr-2 h-4 w-4" /> Nuevo Ingreso
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                <Card className="col-span-1 border-emerald-500/20 bg-emerald-500/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-emerald-600 dark:text-emerald-500">Total Ingresos (Filtrado)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-[150px]" />
                        ) : (
                            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-500">{formatCurrency(totalIngresos)}</div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Historial de Ingresos</CardTitle>
                    <CardDescription>Visualiza y edita todos los ingresos que has registrado.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        {/* Vista de Tabla para Escritorio */}
                        <div className="hidden lg:block overflow-x-auto">
                            <Table className="min-w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Descripción</TableHead>
                                        <TableHead>Categoría</TableHead>
                                        <TableHead className="text-right">Monto</TableHead>
                                        <TableHead className="w-[100px] text-center">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        [...Array(3)].map((_, i) => (
                                            <TableRow key={i}>
                                                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                                <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                                                <TableCell><Skeleton className="h-8 w-16 mx-auto" /></TableCell>
                                            </TableRow>
                                        ))
                                    ) : filteredIngresos.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                                No hay ingresos en este rango.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        paginatedItems.map((ingreso) => (
                                            <TableRow key={ingreso.id}>
                                                <TableCell className="text-xs">{format(parseISO(ingreso.fecha), 'dd/MM/yyyy')}</TableCell>
                                                <TableCell className="font-medium text-xs">{ingreso.descripcion}</TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted border border-border">
                                                        {ingreso.categorias?.nombre || 'Sin categoría'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right text-emerald-600 dark:text-emerald-500 font-bold text-xs">+{formatCurrency(ingreso.monto)}</TableCell>
                                                <TableCell>
                                                    <div className="flex justify-center gap-2">
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-primary" onClick={() => handleOpenModal(ingreso)}>
                                                            <Pencil className="h-3 w-3" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(ingreso.id)}>
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Vista de Tarjetas para Móvil y Tablet Portrait */}
                        <div className="lg:hidden divide-y divide-border overflow-hidden rounded-md">
                            {isLoading ? (
                                [...Array(3)].map((_, i) => (
                                    <div key={i} className="p-4 space-y-3 bg-background">
                                        <div className="flex justify-between items-center">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-6 w-16 rounded-full" />
                                        </div>
                                        <Skeleton className="h-5 w-full" />
                                        <div className="flex justify-between items-center pt-2">
                                            <Skeleton className="h-6 w-20" />
                                            <div className="flex gap-2">
                                                <Skeleton className="h-8 w-8 rounded-full" />
                                                <Skeleton className="h-8 w-8 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : filteredIngresos.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground bg-background col-span-2">
                                    No hay ingresos en este rango.
                                </div>
                            ) : (
                                paginatedItems.map((ingreso) => (
                                    <div key={ingreso.id} className="p-4 space-y-2 hover:bg-muted/50 transition-colors bg-background">
                                        <div className="flex justify-between items-start">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                                    {format(parseISO(ingreso.fecha), "eeee, d 'de' MMMM", { locale: es })}
                                                </span>
                                                <h4 className="font-bold text-sm leading-tight">{ingreso.descripcion}</h4>
                                            </div>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 whitespace-nowrap">
                                                {ingreso.categorias?.nombre || 'General'}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center pt-2">
                                            <div className="text-lg font-black text-emerald-600">
                                                +{formatCurrency(ingreso.monto)}
                                            </div>
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="secondary"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full bg-primary/10 text-primary hover:bg-primary/20 border-none"
                                                    onClick={() => handleOpenModal(ingreso)}
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 border-none"
                                                    onClick={() => handleDelete(ingreso.id)}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-4">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            className={cn("cursor-pointer", currentPage === 1 && "pointer-events-none opacity-50")}
                                        />
                                    </PaginationItem>
                                    <PaginationItem>
                                        <span className="px-4 text-sm">
                                            Página {currentPage} de {totalPages}
                                        </span>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            className={cn("cursor-pointer", currentPage === totalPages && "pointer-events-none opacity-50")}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </CardContent>
            </Card>

            {
                isModalOpen && (
                    <TransactionModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSave={handleSaveIngreso}
                        type="ingreso"
                        initialData={editingIngreso}
                    />
                )
            }
        </div >
    );
}
