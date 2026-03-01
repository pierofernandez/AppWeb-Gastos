import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, Wallet, ArrowRightLeft, Tags, BarChart3, Settings, LogOut, Sun, Moon, ChevronRight, Lightbulb, LifeBuoy, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { useTheme } from '../theme-provider';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "../ui/breadcrumb";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "../ui/sheet";

function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    return (
        <Button variant="outline" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";

function SidebarContent({ navigation, user, logout, onNavItemClick }) {
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    return (
        <div className="flex h-full flex-col">
            <div className="flex h-14 items-center gap-3 border-b border-border px-4">
                <img
                    src="/img/silvano.webp"
                    alt="Logo"
                    className="h-8 w-8 rounded-full border border-primary/20 object-cover"
                />
                <h2 className="text-lg font-bold tracking-tight text-primary">NoSeasVagre</h2>
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto py-4">
                <nav className="flex-1 space-y-1 px-2">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            onClick={onNavItemClick}
                            className={({ isActive }) =>
                                `group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors ${isActive
                                    ? 'bg-secondary text-foreground'
                                    : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                                }`
                            }
                        >
                            <item.icon
                                className="mr-3 h-5 w-5 flex-shrink-0"
                                aria-hidden="true"
                            />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* User profile / Logout at the bottom */}
            <div className="border-t border-border p-4 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold uppercase">
                        {user?.email?.charAt(0) || 'U'}
                    </div>
                    <div className="text-sm overflow-hidden flex-1">
                        <p className="truncate font-medium">{user?.email}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="flex-1 justify-start text-muted-foreground hover:text-destructive hover:border-destructive transition-colors"
                        onClick={() => setIsLogoutModalOpen(true)}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Salir
                    </Button>
                    <ThemeToggle />
                </div>
            </div>

            <Dialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Cerrar sesión</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de que deseas cerrar tu sesión actual? Tendrás que volver a ingresar tus credenciales para acceder de nuevo.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setIsLogoutModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={logout}>
                            Cerrar Sesión
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Mapeo de rutas a nombres legibles
    const pathNames = {
        'dashboard': 'Panel Principal',
        'ingresos': 'Ingresos',
        'gastos': 'Gastos',
        'categorias': 'Categorías',
        'reportes': 'Análisis de Reportes',
        'configuracion': 'Configuración',
        'sugerencias': 'Sugerencias y Guía',
        'soporte': 'Soporte Técnico',
    };

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Ingresos', href: '/ingresos', icon: Wallet },
        { name: 'Gastos', href: '/gastos', icon: ArrowRightLeft },
        { name: 'Categorías', href: '/categorias', icon: Tags },
        { name: 'Reportes', href: '/reportes', icon: BarChart3 },
        { name: 'Sugerencias', href: '/sugerencias', icon: Lightbulb },
        { name: 'Soporte', href: '/soporte', icon: LifeBuoy },
        { name: 'Configuración', href: '/configuracion', icon: Settings },
    ];

    // Generar breadcrumbs basados en la URL actual
    const segments = location.pathname.split('/').filter(Boolean);

    return (
        <div className="flex h-screen bg-background">
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 flex-col border-r border-border bg-card md:flex">
                <SidebarContent navigation={navigation} user={user} logout={logout} />
            </aside>

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="flex h-14 items-center gap-4 border-b border-border bg-card px-4 md:hidden">
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-64">
                            <SidebarContent
                                navigation={navigation}
                                user={user}
                                logout={logout}
                                onNavItemClick={() => setIsMobileMenuOpen(false)}
                            />
                        </SheetContent>
                    </Sheet>

                    <div className="flex items-center gap-2">
                        <img
                            src="/img/silvano.webp"
                            alt="Logo"
                            className="h-6 w-6 rounded-full object-cover"
                        />
                        <h2 className="text-base font-bold tracking-tight text-primary">NoSeasVagre</h2>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    {/* Breadcrumbs Section */}
                    <div className="mb-6">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link to="/dashboard" className="flex items-center gap-1">
                                            <LayoutDashboard className="h-3 w-3" />
                                            App
                                        </Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>

                                {segments.length > 0 && segments[0] !== 'dashboard' && (
                                    <>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>
                                                {pathNames[segments[0]] || segments[0]}
                                            </BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </>
                                )}

                                {segments[0] === 'dashboard' && segments.length === 1 && (
                                    <>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>Panel Principal</BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </>
                                )}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>

                    <Outlet />
                </main>
            </div>
        </div>
    );
}
