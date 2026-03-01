import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../hooks/use-toast';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';
import { translateError } from '../../lib/auth-errors';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            toast({
                title: "Error",
                description: translateError(error.message),
                variant: "destructive",
            });
        } else {
            toast({
                title: "Correo enviado",
                description: "Revisa tu bandeja de entrada para restablecer tu contraseña.",
            });
            setEmail('');
        }
        setLoading(false);
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-background p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight">Recuperar Contraseña</CardTitle>
                    <CardDescription>
                        Ingresa tu correo para enviarte las instrucciones
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleReset}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Enviar instrucciones
                        </Button>
                        <div className="text-center text-sm text-muted-foreground mt-4">
                            <Link to="/login" className="flex items-center justify-center font-semibold text-primary hover:underline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Volver al inicio de sesión
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
