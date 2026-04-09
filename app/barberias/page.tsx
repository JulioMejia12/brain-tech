import Barberias from "../components/layout/Barberias"

const page = () => {
    return (
        <Barberias
            logo="/barber.png"
            title="Golden Barber"
            primary="#c18b27"
            secondary="#e5b65d"
            background="#052310"
            textColor="#000100"
            // textColor="#f1c56d"
            heroImage="/image.jpeg"
            whatsappNumber="1234567890"
        >
            {/* aquí: maqueta de la barbería */}
            {/* <div className="space-y-6">
                algo de info
            </div> */}
        </Barberias>
    )
}

export default page