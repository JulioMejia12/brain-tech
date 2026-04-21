
const Footer = () => {
    return (
        <footer className="bg-white border-t">
            <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
                <div>© {new Date().getFullYear()} Brain Tech. Todos los derechos reservados.</div>
                <div className="flex gap-4 mt-3 md:mt-0">
                    <a style={{ color: 'primary' }} className="hover:opacity-90">Términos</a>
                    <a style={{ color: 'primary' }} className="hover:opacity-90">Privacidad</a>
                </div>
            </div>
        </footer>
    )
}

export default Footer