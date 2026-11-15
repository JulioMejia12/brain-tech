type BetterwareFooterProps = {
    backgroundColor?: string
    textColor?: string
    mutedTextColor?: string
    borderColor?: string
}

const BetterwareFooter = ({
    backgroundColor = '#4C2365',
    textColor = '#ffffff',
    mutedTextColor = 'rgba(255, 255, 255, 0.8)',
    borderColor = 'rgba(255, 255, 255, 0.15)',
}: BetterwareFooterProps) => {
    return (
        <footer className="border-t" style={{ backgroundColor, borderColor, color: textColor }}>
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-6 py-6 text-sm md:flex-row">
                <div style={{ color: mutedTextColor }}>
                    © {new Date().getFullYear()} Brain Tech. Todos los derechos reservados.
                </div>
                <div className="mt-3 flex gap-4 md:mt-0">
                    <a
                        className="opacity-80 transition hover:opacity-100"
                        style={{ color: textColor }}
                    >
                        Términos
                    </a>
                    <a
                        className="opacity-80 transition hover:opacity-100"
                        style={{ color: textColor }}
                    >
                        Privacidad
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default BetterwareFooter
