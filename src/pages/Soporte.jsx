import React, { useState } from 'react';
import { Send, MessageSquare, LifeBuoy, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../lib/supabase';

export default function Soporte() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        asunto: '',
        mensaje: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.asunto || !formData.mensaje) {
            toast({
                title: "Campos incompletos",
                description: "Por favor, completa todos los campos del formulario.",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('soporte')
                .insert([{
                    usuario_id: user.id,
                    asunto: formData.asunto,
                    mensaje: formData.mensaje
                }]);

            if (error) throw error;

            setIsSuccess(true);
            setFormData({ asunto: '', mensaje: '' });
            toast({
                title: "Ticket enviado",
                description: "Tu consulta ha sido registrada exitosamente.",
            });
        } catch (error) {
            toast({
                title: "Error al enviar",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                <div className="h-20 w-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">¡Mensaje Recibido!</h2>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                        Gracias por contactarnos. Revisaremos tu consulta y te responderemos a tu correo lo antes posible.
                    </p>
                </div>
                <Button onClick={() => setIsSuccess(false)} variant="outline">
                    Enviar otro mensaje
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-xl mb-2">
                    <LifeBuoy className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Centro de Soporte</h1>
                <p className="text-muted-foreground">
                    ¿Tienes problemas con la app o alguna sugerencia? Estamos aquí para ayudarte.
                </p>
            </div>

            <Card className="border-border shadow-lg">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        <CardTitle>Enviar un Ticket</CardTitle>
                    </div>
                    <CardDescription>Completa el formulario y nos pondremos en contacto contigo.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="asunto">Asunto</Label>
                            <Input
                                id="asunto"
                                placeholder="Ej: Error al cargar gráficos"
                                value={formData.asunto}
                                onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                                className="border-border"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mensaje">Mensaje detallado</Label>
                            <Textarea
                                id="mensaje"
                                placeholder="Describe tu problema o sugerencia aquí..."
                                rows={5}
                                value={formData.mensaje}
                                onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                                className="border-border resize-none"
                            />
                        </div>
                        <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg border border-border">
                            <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <p className="text-[11px] text-muted-foreground">
                                Tu consulta será asociada a un especialista,
                                respondemos en un plazo máximo de 24-48 horas hábiles.
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t border-border pt-6">
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Enviando...' : (
                                <>
                                    <Send className="mr-2 h-4 w-4" /> Enviar Ticket
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
