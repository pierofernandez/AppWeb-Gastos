import React from 'react';
import { Link } from 'react-router-dom';
import {
    Lightbulb,
    BookOpen,
    TrendingDown,
    Wallet,
    CheckCircle2,
    Target,
    HelpCircle,
    PiggyBank,
    Zap,
    Tags,
    Copy,
    Check
} from 'lucide-react';
import { Button } from '../components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../components/ui/dialog";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '../components/ui/card';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../components/ui/accordion";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../components/ui/tabs";

export default function Sugerencias() {
    const [copied, setCopied] = React.useState(false);

    const copyEmail = () => {
        navigator.clipboard.writeText("pierofernandezz48@gmail.com");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-center sm:text-left">Centro de Ayuda y Sugerencias</h1>
                <p className="text-muted-foreground mt-1 text-center sm:text-left">
                    Aprende a dominar tus finanzas y a utilizar AppGastos como un experto.
                </p>
            </div>

            <Tabs defaultValue="uso" className="w-full">
                <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
                    <TabsTrigger value="uso">Uso de App</TabsTrigger>
                    <TabsTrigger value="ahorro">Tips Ahorro</TabsTrigger>
                    <TabsTrigger value="categorias">Categorías</TabsTrigger>
                </TabsList>

                <TabsContent value="uso" className="mt-6 space-y-6">
                    <Card className="border-border shadow-sm">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg">Guía de Inicio Rápido</CardTitle>
                            </div>
                            <CardDescription>Aprende los conceptos básicos para mantener tus cuentas al día.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>¿Cómo registrar mi primer gasto?</AccordionTrigger>
                                    <AccordionContent>
                                        Ve a la sección de **Gastos** y haz clic en el botón **"Nuevo Gasto"**.
                                        Asegúrate de seleccionar una categoría y un método de pago para que tus reportes sean precisos.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>Personalizar mis categorías</AccordionTrigger>
                                    <AccordionContent>
                                        En la página de **Categorías**, puedes añadir nuevas carpetas para agrupar tus gastos.
                                        Te recomendamos usar nombres cortos y asignarles un color para identificarlas visualmente en los gráficos.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>Entender el Dashboard</AccordionTrigger>
                                    <AccordionContent>
                                        El **Panel Principal** te muestra un resumen de tu mes actual.
                                        El gráfico circular te ayuda a ver en qué se va la mayor parte de tu dinero, mientras que la línea de tiempo muestra tendencias diarias.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="bg-primary/5 border-primary/20">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Zap className="h-4 w-4 text-primary" /> Tip Pro
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm">
                                Registra tus gastos al instante. Si esperas al final de la semana, es probable que olvides los montos pequeños o "gastos hormiga".
                            </CardContent>
                        </Card>
                        <Card className="bg-secondary/5 border-secondary/20">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Target className="h-4 w-4 text-emerald-500" /> Metas
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm">
                                Revisa tus reportes cada domingo. Esto te permitirá ajustar tu presupuesto para la siguiente semana si ves que te has excedido.
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="ahorro" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card className="border-border shadow-sm hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <PiggyBank className="h-8 w-8 text-primary mb-2" />
                                <CardTitle className="text-base">Regla 50/30/20</CardTitle>
                                <CardDescription>El estándar de oro para presupuestar.</CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                Destina el **50%** a necesidades (renta, comida), el **30%** a deseos (salidas, cine) y el **20%** a ahorro o pago de deudas.
                            </CardContent>
                        </Card>

                        <Card className="border-border shadow-sm hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <TrendingDown className="h-8 w-8 text-destructive mb-2" />
                                <CardTitle className="text-base">Elimina Gastos Hormiga</CardTitle>
                                <CardDescription>Esos pequeños montos que suman.</CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                El café diario, suscripciones que no usas o snacks de paso pueden sumar hasta un 15% de tus ingresos mensuales sin que te des cuenta.
                            </CardContent>
                        </Card>

                        <Card className="border-border shadow-sm hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <Wallet className="h-8 w-8 text-emerald-500 mb-2" />
                                <CardTitle className="text-base">Fondo de Emergencia</CardTitle>
                                <CardDescription>Tu tranquilidad mental.</CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                Intenta ahorrar lo suficiente para cubrir 3 a 6 meses de tus gastos básicos. Empieza con una meta pequeña de S/500.
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="mt-6 border-border shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Hábitos Ganadores
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div className="space-y-1">
                                <p className="font-bold text-sm">Lista de Compras</p>
                                <p className="text-xs text-muted-foreground">Nunca vayas al súper con hambre o sin una lista definida.</p>
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold text-sm">Compara Precios</p>
                                <p className="text-xs text-muted-foreground">Investiga antes de compras grandes. Usa herramientas de comparación.</p>
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold text-sm">Día Sin Gastos</p>
                                <p className="text-xs text-muted-foreground">Retate a tener un día a la semana donde el gasto sea CERO.</p>
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold text-sm">Automatiza</p>
                                <p className="text-xs text-muted-foreground">Si puedes, automatiza una transferencia pequeña a tus ahorros.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="categorias" className="mt-6 space-y-6">
                    <Card className="border-border shadow-sm">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Tags className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg">Categorización Eficiente</CardTitle>
                            </div>
                            <CardDescription>Cómo organizar tus gastos para un mejor análisis.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm">
                                Una buena categorización es la base de un buen reporte. No crees demasiadas categorías, pero tampoco muy pocas.
                                Aquí tienes una estructura recomendada:
                            </p>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="p-4 rounded-lg border border-border bg-muted/30">
                                    <h4 className="font-bold text-sm mb-2 text-primary">Esenciales (Fijos)</h4>
                                    <ul className="text-xs space-y-1 text-muted-foreground list-disc list-inside">
                                        <li>Vivienda / Alquiler</li>
                                        <li>Servicios (Luz, Agua, Internet)</li>
                                        <li>Supermercado</li>
                                        <li>Transporte / Combustible</li>
                                        <li>Seguros / Salud</li>
                                    </ul>
                                </div>
                                <div className="p-4 rounded-lg border border-border bg-muted/30">
                                    <h4 className="font-bold text-sm mb-2 text-emerald-600">Lifestyle (Variables)</h4>
                                    <ul className="text-xs space-y-1 text-muted-foreground list-disc list-inside">
                                        <li>Restaurantes / Delivery</li>
                                        <li>Entretenimiento (Netflix, Cine)</li>
                                        <li>Ropa / Estética</li>
                                        <li>Educación / Cursos</li>
                                        <li>Regalos / Otros</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="flex flex-col items-center justify-center py-10 text-center space-y-4 bg-muted/20 rounded-2xl border border-dashed border-border">
                <HelpCircle className="h-12 w-12 text-muted-foreground/50" />
                <div>
                    <h3 className="text-xl font-bold">¿Aún tienes dudas?</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Nuestro equipo está trabajando para añadir más guías interactivas.
                        ¡Mantente al tanto de las actualizaciones!
                    </p>
                </div>
                <Button variant="outline" className="mt-4" asChild>
                    <Link to="/soporte">Contactar Soporte</Link>
                </Button>
            </div>

            <div className="pt-6 border-t border-border">
                <Card className="bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 border-primary/10 overflow-hidden">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto h-12 w-12 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm flex items-center justify-center mb-4">
                            <PiggyBank className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Apoya el Proyecto</CardTitle>
                        <CardDescription>Si esta herramienta te ayuda, considera apoyarnos para seguir mejorando.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2 mt-4">
                            {/* PayPal Section */}
                            <div className="flex flex-col items-center p-6 bg-card rounded-2xl border border-border shadow-sm hover:translate-y-[-4px] transition-all group">
                                <img
                                    src="/img/paypal.webp"
                                    alt="PayPal Logo"
                                    className="h-20 w-auto mb-4 object-contain drop-shadow-md"
                                />
                                <p className="text-sm font-bold mb-1">Paypal</p>
                                <p className="text-xs text-muted-foreground text-center mb-2">Donaciones internacionales.</p>
                                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg border border-border w-full justify-between">
                                    <span className="text-[10px] font-mono truncate">pierofernandezz48@gmail.com</span>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyEmail}>
                                        {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                                    </Button>
                                </div>
                            </div>

                            {/* Yape/Plin Section */}
                            <div className="flex flex-col items-center p-6 bg-card rounded-2xl border border-border shadow-sm hover:translate-y-[-4px] transition-all group">
                                <img
                                    src="/img/yape_plin.webp"
                                    alt="Yape Plin QR"
                                    className="h-20 w-auto mb-4 object-contain drop-shadow-md"
                                />
                                <p className="text-sm font-bold mb-1">Yape o Plin</p>
                                <p className="text-xs text-muted-foreground text-center mb-1">992431858</p>
                                <p className="text-[10px] text-muted-foreground text-center mb-4">Escanea el QR para apoyarnos (Perú).</p>

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="secondary" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">Ver Código QR</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md border-border bg-card">
                                        <DialogHeader>
                                            <DialogTitle className="text-center">Donar con Yape o Plin</DialogTitle>
                                            <DialogDescription className="text-center">
                                                Número: 992431858
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="flex items-center justify-center p-4 bg-white rounded-xl">
                                            <img
                                                src="/img/qr_yape.webp"
                                                alt="QR Yape"
                                                className="max-h-[300px] w-auto rounded-lg shadow-sm"
                                            />
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest bg-muted/50 py-1 px-4 inline-block rounded-full">Gracias por tu generosidad ❤️</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
