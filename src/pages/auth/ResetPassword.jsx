import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../hooks/use-toast';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Loader2, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { translateError } from '../../lib/auth-errors';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar si hay una sesión activa (Supabase pone al usuario en sesión al cliquear el link de recovery)
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                toast({
                    title: "Enlace inválido o expirado",
                    description: "Por favor, solicita un nuevo enlace de recuperación.",
                    variant: "destructive",
                });
                navigate('/forgot-password');
            }
        };
        checkSession();
    }, [navigate, toast]);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return toast({
                title: "Error",
                description: "Las contraseñas no coinciden.",
                variant: "destructive",
            });
        }

        if (password.length < 6) {
            return toast({
                title: "Error",
                description: "La contraseña debe tener al menos 6 caracteres.",
                variant: "destructive",
            });
        }

        setLoading(true);

        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            toast({
                title: "Error",
                description: translateError(error.message),
                variant: "destructive",
            });
        } else {
            toast({
                title: "Contraseña actualizada",
                description: "Tu contraseña ha sido cambiada exitosamente.",
            });
            // Cerrar sesión para que el usuario entre con su nueva clave o redirigir al dashboard
            navigate('/dashboard');
        }
        setLoading(false);
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-background p-4">
            <Card className="w-full max-w-sm border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-2">
                        <div className="p-3 rounded-full bg-emerald-500/10">
                            <ShieldCheck className="h-6 w-6 text-emerald-500" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Nueva Contraseña</CardTitle>
                    <CardDescription>
                        Ingresa tu nueva contraseña para completar el proceso.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdatePassword}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Nueva Contraseña</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="border-border pr-10"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="border-border pr-10"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700" type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Actualizar Contraseña
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
