import fs from 'fs'
import path from 'path'
import readline from 'readline'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const TEMPLATE_ROOT = path.resolve(__dirname, '..')
const DEFAULT_CLIENTS_DIR = 'C:\\Users\\roman\\OneDrive\\Escritorio\\proyectos-desarrollo\\invitaciones\\Clientes'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

const ask = (query, defaultValue = '') => {
    return new Promise((resolve) => {
        const promptText = defaultValue ? `${query} (Predeterminado: ${defaultValue}): ` : `${query}: `
        rl.question(promptText, (answer) => {
            resolve(answer.trim() || defaultValue)
        })
    })
}

const askSelect = async (query, options) => {
    console.log(`\n${query}`)
    options.forEach((opt, index) => {
        console.log(`  ${index + 1}) ${opt.label}`)
    })
    const choiceStr = await ask('Selecciona una opción (número)', '1')
    const choiceNum = parseInt(choiceStr, 10)
    if (isNaN(choiceNum) || choiceNum < 1 || choiceNum > options.length) {
        return options[0].value
    }
    return options[choiceNum - 1].value
}

const askBoolean = async (query, defaultValue = true) => {
    const defaultStr = defaultValue ? 'S' : 'N'
    const answer = await ask(`${query} (S/N)`, defaultStr)
    return answer.toUpperCase().startsWith('S')
}

// Copiar directorio recursivamente excluyendo carpetas pesadas
const copyRecursive = (src, dest) => {
    const ignoreList = ['node_modules', '.git', 'dist', '.gemini', '.vscode']
    const stats = fs.statSync(src)

    if (stats.isDirectory()) {
        const basename = path.basename(src)
        if (ignoreList.includes(basename)) return

        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true })
        }

        const entries = fs.readdirSync(src)
        for (const entry of entries) {
            copyRecursive(path.join(src, entry), path.join(dest, entry))
        }
    } else {
        fs.copyFileSync(src, dest)
    }
}

async function main() {
    console.log('\n==================================================')
    console.log('  ✨ ASISTENTE INTERACTIVO DE CREACIÓN DE INVITACIONES ✨')
    console.log('==================================================\n')

    // 1. Datos del Proyecto
    const defaultFolderName = 'invitacion-' + Date.now().toString().slice(-4)
    const folderName = await ask('1. Nombre del proyecto / carpeta para el cliente', defaultFolderName)

    const baseOutputDir = await ask('2. Ruta raíz de almacenamiento de clientes', DEFAULT_CLIENTS_DIR)
    const targetPath = path.join(baseOutputDir, folderName)

    console.log(`\n📁 El nuevo proyecto se creará en:\n   ${targetPath}\n`)

    // 2. Información del Evento
    const names = await ask('3. Nombres principales (ej: María & Carlos o Mis XV Sofía)', 'María & Carlos')
    const eventDate = await ask('4. Fecha y Hora del Evento (ISO o YYYY-MM-DDTHH:mm:ss)', '2026-11-20T17:00:00')
    const subtitle = await ask(
        '5. Subtítulo / Frase de bienvenida',
        'Nos complace invitarte a celebrar el día más importante de nuestras vidas'
    )
    const welcomeMessage = await ask(
        '6. Mensaje especial',
        'Te invitamos de corazón a acompañarnos en este momento tan especial y celebrar juntos el amor que nos une.'
    )

    // 3. Tema Visual
    const fontPack = await askSelect('7. Selecciona el Pack de Fuentes Tipográficas:', [
        { label: 'Pack 1: Elegante (Playfair Display + Greating + Open Sans)', value: 1 },
        { label: 'Pack 2: Moderno (Cinzel + Amsterdam + Montserrat)', value: 2 },
        { label: 'Pack 3: Clásico (EB Garamond + Halimunde + Raleway)', value: 3 },
        { label: 'Pack 4: Chic (Outfit + Alex Brush + Plus Jakarta Sans)', value: 4 },
        { label: 'Pack 5: Romántico (Cormorant Garamond + Pinyon Script + Roboto)', value: 5 },
    ])

    const palette = await askSelect('8. Selecciona la Paleta de Colores:', [
        { label: 'Paleta 1: Rosa Romántico & Terracota', value: 1 },
        { label: 'Paleta 2: Verde Olivo & Oro', value: 2 },
        { label: 'Paleta 3: Azul Mar Profundo & Plata', value: 3 },
        { label: 'Paleta 4: Vino & Champán', value: 4 },
        { label: 'Paleta 5: Salvia & Eucalipto', value: 5 },
        { label: 'Paleta 6: Lavanda & Lila', value: 6 },
        { label: 'Paleta 7: Esmeralda & Bronce', value: 7 },
        { label: 'Paleta 8: Crema & Dorado Real', value: 8 },
        { label: 'Paleta 9: Marrón Cálido & Arena', value: 9 },
        { label: 'Paleta 10: Negro & Oro Minimalista', value: 10 },
    ])

    const menuSelection = await askSelect('9. Configuración del Menú de Navegación:', [
        { label: 'Barra Superior Fija (bar)', value: { show: true, variant: 'bar' } },
        { label: 'Botón Flotante Lateral (floating)', value: { show: true, variant: 'floating' } },
        { label: 'Desactivar Menú', value: { show: false, variant: 'floating' } },
    ])

    const musicSelection = await askSelect('10. Configuración del Reproductor de Música:', [
        { label: 'Botón Flotante de Audio (floating)', value: { show: true, variant: 'floating' } },
        { label: 'Tarjeta de Reproductor Integrada (card)', value: { show: true, variant: 'card' } },
        { label: 'Desactivar Música', value: { show: false, variant: 'floating' } },
    ])

    // 4. Módulos y Funcionalidades
    const hasTicketingSystem = await askBoolean('11. ¿Habilitar sistema de boletos/tickets de acceso?', false)
    const hasRSVP = await askBoolean('12. ¿Habilitar confirmación de asistencia RSVP?', true)

    // 5. Secciones
    console.log('\n--- Configuración de Secciones ---')
    const showCountdown = await askBoolean('13. ¿Incluir sección de Cuenta Regresiva?', true)
    const showPlaces = await askBoolean('14. ¿Incluir sección de Ubicaciones / Lugares?', true)
    const showItinerary = await askBoolean('15. ¿Incluir sección de Itinerario?', true)
    const showDressCode = await askBoolean('16. ¿Incluir sección de Código de Vestimenta?', true)
    const showGallery = await askBoolean('17. ¿Incluir sección de Galería de Fotos?', true)
    const showPresents = await askBoolean('18. ¿Incluir sección de Mesa de Regalos?', true)

    rl.close()

    console.log('\n⏳ Generando nuevo proyecto de invitación...')

    // Construcción del objeto invitation.config.json
    const configManifest = {
        theme: {
            fontPack,
            palette,
            buttonVariant: 'primary',
            menu: {
                show: menuSelection.show,
                variant: menuSelection.variant,
                title: names,
                buttonVariant: 'icon',
            },
            music: {
                show: musicSelection.show,
                variant: musicSelection.variant,
                buttonVariant: 'primary',
                songTitle: 'Música de fondo',
                artistName: 'Música del evento',
            },
        },
        config: {
            hasTicketingSystem,
            hasRSVP,
            hasMusic: musicSelection.show,
            hasMenu: menuSelection.show,
        },
        sections: {
            hero: {
                showHero: true,
                names,
                subtitle,
                date: new Date(eventDate).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                }).toUpperCase(),
                bgImage: '',
            },
            message: {
                showMessage: true,
                message: welcomeMessage,
            },
            countdown: {
                showCountdown,
                targetDate: eventDate,
            },
            places: {
                showPlaces,
                locations: [
                    {
                        title: 'Ceremonia',
                        location: 'Lugar por definir',
                        time: '17:00 HRS',
                        date: eventDate.split('T')[0],
                        url: 'https://maps.google.com',
                    },
                ],
            },
            itinerary: {
                showItinerary,
                itinerary: [
                    { time: '17:00 HRS', event: 'Ceremonia' },
                    { time: '19:00 HRS', event: 'Recepción' },
                ],
            },
            dressCode: {
                showDressCode,
                title: 'Código de Vestimenta',
                description: 'Te sugerimos vestir de etiqueta semi-formal.',
                attire: {
                    men: 'Traje oscuro y corbata.',
                    women: 'Vestido largo o cocktail.',
                },
                colors: {
                    suggested: ['negro', 'azul oscuro'],
                    avoid: ['blanco', 'beige'],
                },
            },
            gallery: {
                showGallery,
                title: 'Galería de Fotos',
                images: [],
            },
            presents: {
                showPresents,
            },
            confirmation: {
                showConfirmation: hasRSVP,
            },
        },
    }

    // Copiar la estructura del template a la carpeta destino
    copyRecursive(TEMPLATE_ROOT, targetPath)

    // Guardar el invitation.config.json personalizado
    const configPath = path.join(targetPath, 'invitation.config.json')
    fs.writeFileSync(configPath, JSON.stringify(configManifest, null, 2), 'utf-8')

    console.log('✅ Archivo invitation.config.json generado exitosamente.')

    // Ejecutar sincronización de tema en el proyecto recién generado
    try {
        console.log('🎨 Sincronizando tokens de tema SCSS...')
        execSync('npm run theme:sync', { cwd: targetPath, stdio: 'inherit' })
    } catch (e) {
        console.warn('⚠️ No se pudo ejecutar theme:sync automáticamente. Puedes ejecutarlo con npm run theme:sync dentro del proyecto.')
    }

    console.log('\n==================================================')
    console.log(' 🎉 ¡PROYECTO DE INVITACIÓN CREADO CON ÉXITO! 🎉')
    console.log('==================================================\n')
    console.log(`📌 Ubicación: ${targetPath}`)
    console.log('\nPara iniciar el desarrollo del proyecto ejecuta:\n')
    console.log(`   cd "${targetPath}"`)
    console.log('   npm install')
    console.log('   npm run dev\n')
}

main().catch(console.error)
