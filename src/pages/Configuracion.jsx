import React, { useState, useEffect, useCallback } from 'react';
import { User, Bell, Shield, Palette, Globe, Save, Eye, EyeOff } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../components/ui/dialog";
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Skeleton } from '../components/ui/skeleton';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import { useTheme } from '../components/theme-provider';
import { supabase } from '../lib/supabase';
import { translateError } from '../lib/auth-errors';

export default function Configuracion() {
    const { user } = useAuth();
    const { theme, setTheme } = useTheme();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Perfil State
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState(user?.email || '');

    // Password State
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [isUpdatingPass, setIsUpdatingPass] = useState(false);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (newPass !== confirmPass) {
            return toast({
                title: "Error",
                description: "Las contraseñas no coinciden.",
                variant: "destructive"
            });
        }
        if (newPass.length < 6) {
            return toast({
                title: "Error",
                description: "La contraseña debe tener al menos 6 caracteres.",
                variant: "destructive"
            });
        }

        setIsUpdatingPass(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPass
            });

            if (error) throw error;

            toast({
                title: "¡Contraseña actualizada!",
                description: "Tu contraseña ha sido cambiada exitosamente.",
            });
            setIsPasswordModalOpen(false);
            setNewPass('');
            setConfirmPass('');
        } catch (error) {
            toast({
                title: "Error al actualizar",
                description: translateError(error.message),
                variant: "destructive"
            });
        } finally {
            setIsUpdatingPass(false);
        }
    };

    const fetchProfile = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('perfiles')
                .select('nombre')
                .eq('id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 is code for no rows found
                throw error;
            }

            if (data) {
                setFullName(data.nombre || '');
            } else {
                // Si no hay perfil, podrías usar el de metadata como fallback inicial
                setFullName(user?.user_metadata?.full_name || '');
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setIsLoading(false);
        }
    }, [user.id, user?.user_metadata?.full_name]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleSavePerfil = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('perfiles')
                .upsert({
                    id: user.id,
                    nombre: fullName
                });

            if (error) throw error;

            toast({
                title: "Perfil actualizado",
                description: "Tus cambios han sido guardados en la base de datos.",
            });
        } catch (error) {
            toast({
                title: "Error al guardar",
                description: translateError(error.message),
                variant: "destructive"
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleSavePreferencias = (e) => {
        e.preventDefault();
        toast({
            title: "Preferencias guardadas",
            description: "Tu configuración de interfaz ha sido actualizada.",
        });
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <Skeleton className="h-9 w-[250px] mb-2" />
                    <Skeleton className="h-4 w-[350px]" />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i} className="border-border shadow-sm">
                            <CardHeader>
                                <Skeleton className="h-5 w-[150px] mb-2" />
                                <Skeleton className="h-4 w-[200px]" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-center sm:text-left">Configuración</h1>
                <p className="text-muted-foreground mt-1 text-center sm:text-left">Administra tu cuenta, perfil y preferencias de la aplicación.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                {/* Perfil de Usuario */}
                <Card className="border-border shadow-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg">Perfil de Usuario</CardTitle>
                        </div>
                        <CardDescription>Información pública y de contacto.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre Completo</Label>
                            <Input
                                id="name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Tu nombre"
                                className="border-border"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input
                                id="email"
                                value={email}
                                readOnly
                                className="bg-muted/50 border-border cursor-not-allowed"
                            />
                            <p className="text-[10px] text-muted-foreground italic">El correo no puede ser modificado por ahora.</p>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t border-border pt-4">
                        <Button onClick={handleSavePerfil} className="ml-auto" disabled={isSaving}>
                            <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </CardFooter>
                </Card>

                {/* Preferencias de Interfaz */}
                <Card className="border-border shadow-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Palette className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg">Preferencias</CardTitle>
                        </div>
                        <CardDescription>Personaliza tu experiencia visual.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Tema Visual</Label>
                            <div className="flex gap-2">
                                <Button
                                    variant={theme === 'light' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setTheme('light')}
                                    className="flex-1"
                                >
                                    Claro
                                </Button>
                                <Button
                                    variant={theme === 'dark' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setTheme('dark')}
                                    className="flex-1"
                                >
                                    Oscuro
                                </Button>
                                <Button
                                    variant={theme === 'system' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setTheme('system')}
                                    className="flex-1"
                                >
                                    Sistema
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Moneda Principal</Label>
                            <div className="flex items-center gap-2 p-2 rounded-md bg-muted/30 border border-border">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Soles (PEN) - S/</span>
                                <span className="ml-auto text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase font-bold">Default</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t border-border pt-4">
                        <Button onClick={handleSavePreferencias} variant="outline" className="ml-auto border-border">
                            <Save className="mr-2 h-4 w-4" /> Aplicar
                        </Button>
                    </CardFooter>
                </Card>

                {/* Seguridad */}
                <Card className="border-border shadow-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg">Seguridad</CardTitle>
                        </div>
                        <CardDescription>Gestiona tu contraseña y acceso.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button
                            variant="outline"
                            className="w-full border-border justify-start"
                            onClick={() => setIsPasswordModalOpen(true)}
                        >
                            Cambiar Contraseña
                        </Button>
                        <Button variant="outline" className="w-full border-border justify-start">
                            Autenticación de Dos Factores
                        </Button>
                    </CardContent>
                </Card>

                {/* Notificaciones */}
                <Card className="border-border shadow-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg">Notificaciones</CardTitle>
                        </div>
                        <CardDescription>Alertas y recordatorios de gastos.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-2 rounded-md border border-border">
                            <span className="text-sm">Alertas de presupuesto</span>
                            <div className="h-5 w-9 rounded-full bg-primary relative cursor-pointer">
                                <div className="absolute right-1 top-1 h-3 w-3 rounded-full bg-white" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-md border border-border">
                            <span className="text-sm">Resumen semanal</span>
                            <div className="h-5 w-9 rounded-full bg-muted relative cursor-pointer">
                                <div className="absolute left-1 top-1 h-3 w-3 rounded-full bg-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modal de Cambio de Contraseña */}
            <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Actualizar Contraseña</DialogTitle>
                        <DialogDescription>
                            Ingresa tu nueva contraseña a continuación. Debe tener al menos 6 caracteres.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdatePassword} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-password">Nueva Contraseña</Label>
                            <div className="relative">
                                <Input
                                    id="new-password"
                                    type={showPass ? "text" : "password"}
                                    value={newPass}
                                    onChange={(e) => setNewPass(e.target.value)}
                                    className="pr-10"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-new-password">Confirmar Contraseña</Label>
                            <div className="relative">
                                <Input
                                    id="confirm-new-password"
                                    type={showConfirmPass ? "text" : "password"}
                                    value={confirmPass}
                                    onChange={(e) => setConfirmPass(e.target.value)}
                                    className="pr-10"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showConfirmPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsPasswordModalOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isUpdatingPass}>
                                {isUpdatingPass ? (
                                    <>
                                        <Save className="mr-2 h-4 w-4 animate-spin" /> Actualizando...
                                    </>
                                ) : (
                                    "Guardar Contraseña"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
