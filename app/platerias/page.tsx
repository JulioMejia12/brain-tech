import Barberias from "../components/layout/Barberias"
import config from '../demo/plateria-config.json'

const page = () => {
    return (
        <Barberias
            logo={config.logo}
            title={config.name}
            primary={config.primaryColor}
            secondary={config.secondaryColor}
            textColor={config.textColor}
            heroImage={config.heroImage}
            whatsappNumber={config.contact?.phone}
            about={config.about}
            services={config.services}
        />
    )
}

export default page