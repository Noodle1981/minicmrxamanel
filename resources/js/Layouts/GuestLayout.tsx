import React, { PropsWithChildren } from 'react';
import { Link } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-[#0A0C10] text-[#F0F2F5] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden antialiased selection:bg-[#30EEE2] selection:text-[#0A0C10]">
            {/* Glows Estáticos de Fondo Aurora (Sin animaciones que afecten a los ojos) */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-br from-[#30EEE2]/10 via-[#3C84CE]/10 to-[#65005E]/15 rounded-full blur-3xl pointer-events-none"></div>

            {/* Logo de Grupo Xamanen */}
            <div className="mb-6 text-center z-10">
                <Link href="/" className="inline-flex items-center gap-3 group">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#30EEE2] via-[#3C84CE] to-[#65005E] p-[1.5px] shadow-xl shadow-[#30EEE2]/20">
                        <div className="w-full h-full bg-[#0A0C10] rounded-[14px] flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-[#30EEE2] group-hover:scale-110 transition-transform" />
                        </div>
                    </div>
                    <div className="text-left">
                        <span className="font-heading font-extrabold text-2xl text-white tracking-wide block">
                            Grupo <span className="text-[#30EEE2]">Xamanen</span>
                        </span>
                        <span className="text-xs text-white/50 tracking-wider uppercase block font-medium">
                            CPQ & Plataforma de Gestión
                        </span>
                    </div>
                </Link>
            </div>

            {/* Contenedor Glass Panel */}
            <div className="w-full sm:max-w-xl z-10">
                {children}
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-xs text-white/40 z-10">
                © {new Date().getFullYear()} Grupo Xamanen. Soluciones Tecnológicas de Vanguardia.
            </div>
        </div>
    );
}
