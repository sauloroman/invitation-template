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
        const promptText = defaultValue ? `${query} (Predeterminado: "${defaultValue}"): ` : `${query}: `
        rl.question(promptText, (answer) => {
            resolve(answer.trim() || defaultValue)
        })
    })
}

const askSelect = async (query, options) => {
    console.log(`\n📌 ${query}`)
    options.forEach((opt, index) => {
        console.log(`   [${index + 1}] ${opt.label}`)
    })
    const choiceStr = await ask('   Selecciona una opción (número)', '1')
    const choiceNum = parseInt(choiceStr, 10)
    if (isNaN(choiceNum) || choiceNum < 1 || choiceNum > options.length) {
        return options[0].value
    }
    return options[choiceNum - 1].value
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

const formatDateFormatted = (dateStr) => {
    try {
        const [year, month, day] = dateStr.split('-').map(Number)
        if (year && month && day) {
            const dateObj = new Date(year, month - 1, day)
            return dateObj.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }).toUpperCase()
        }
    } catch {
        // Fallback
    }
    return '20 DE NOVIEMBRE DE 2026'
}

async function main() {
    console.log('\n===================================================================')
    console.log('  ✨ WIZARD DE CONFIGURACIÓN Y CREACIÓN DE NUEVA INVITACIÓN ✨')
    console.log('===================================================================\n')

    // 0. Nombre del directorio de salida
    const defaultFolderName = 'invitacion-' + Date.now().toString().slice(-4)
    const folderName = await ask('📁 Nombre de la carpeta cliente para guardar', defaultFolderName)
    const baseOutputDir = await ask('📁 Ruta raíz de almacenamiento de clientes', DEFAULT_CLIENTS_DIR)
    const targetPath = path.join(baseOutputDir, folderName)

    console.log(`\n📌 El nuevo proyecto se creará en:\n   ${targetPath}\n`)

    // 1. Nombre de los novios
    const names = await ask('1. Nombre de los novios / festejados', 'María & Carlos')

    // 2. Fecha de la ceremonia religiosa
    const religiousDate = await ask('2. Fecha de la ceremonia religiosa (YYYY-MM-DD)', '2026-11-20')

    // 3. Hora de la ceremonia religiosa
    const religiousTime = await ask('3. Hora de la ceremonia religiosa', '17:00 HRS')

    // 4. Dirección Completa de la ceremonia religiosa
    const religiousAddress = await ask('4. Dirección Completa (Ceremonia Religiosa)', 'Catedral Metropolitana, Centro Histórico')

    // 5. Url de dirección de la ceremonia religiosa
    const religiousUrl = await ask('5. URL de Google Maps (Ceremonia Religiosa)', 'https://maps.google.com')

    // 6. Fecha de la fiesta/recepción
    const partyDate = await ask('6. Fecha de la fiesta / recepción (YYYY-MM-DD)', '2026-11-20')

    // 7. Hora de la fiesta/recepción
    const partyTime = await ask('7. Hora de la fiesta / recepción', '19:00 HRS')

    // 8. Dirección Completa fiesta/recepción
    const partyAddress = await ask('8. Dirección Completa (Fiesta / Recepción)', 'Salón Los Pinos, Av. Reforma 123')

    // 9. Url de dirección fiesta/recepción
    const partyUrl = await ask('9. URL de Google Maps (Fiesta / Recepción)', 'https://maps.google.com')

    // 10. Itinerario (bucle do-while hasta ingresar -1)
    console.log('\n10. Configuración del Itinerario de Eventos:')
    console.log('    (Captura hora y título. Escribe -1 en la hora cuando termines para continuar)')

    const itineraryItems = []
    let keepAdding = true

    while (keepAdding) {
        const timeInput = await ask(
            `   -> Hora de la amenidad #${itineraryItems.length + 1} (o -1 para finalizar)`,
            itineraryItems.length === 0 ? religiousTime : '-1'
        )

        if (timeInput === '-1') {
            keepAdding = false
            break
        }

        const eventTitle = await ask(`   -> Título / Amenidad para ${timeInput}`, 'Ceremonia Religiosa')
        itineraryItems.push({ time: timeInput, event: eventTitle })
    }

    if (itineraryItems.length === 0) {
        itineraryItems.push(
            { time: religiousTime, event: 'Ceremonia Religiosa' },
            { time: partyTime, event: 'Recepción & Fiesta' }
        )
    }

    // 11. Título de mesa de regalos
    const presentsTitle = await ask('11. Título de Mesa de Regalos / Tienda', 'Mesa de Regalos Liverpool')

    // 12. Mesa de regalos (link)
    const presentsUrl = await ask('12. Link / URL de la Mesa de Regalos', 'https://mesaderegalos.liverpool.com.mx')

    // 13. Paleta de colores a usar (1 a 8 según _palettes.scss)
    const palette = await askSelect('13. Paleta de Colores a usar:', [
        { label: 'Paleta 1: Dusty Rose & Deep Plum', value: 1 },
        { label: 'Paleta 2: Crimson Wine & Warm Gold', value: 2 },
        { label: 'Paleta 3: Olive Sage & Warm Taupe', value: 3 },
        { label: 'Paleta 4: Forest Green, Soft Lime & Powder Pink', value: 4 },
        { label: 'Paleta 5: Soft Blue, Rose & Steel Blue', value: 5 },
        { label: 'Paleta 6: Slate Teal, Mint & Sage', value: 6 },
        { label: 'Paleta 7: Fresh Lime & Olive Greens', value: 7 },
        { label: 'Paleta 8: Warm Gold, Ochre & Terracotta Brown', value: 8 },
    ])

    // 14. Estilo de Tipografía (1 a 5 según _fonts.scss)
    const fontPack = await askSelect('14. Estilo de Tipografía (Font Pack):', [
        { label: 'Pack 1: Alex Brush (Cursive) + Cormorant Garamond (Serif) + Montserrat (Sans)', value: 1 },
        { label: 'Pack 2: Pinyon Script (Cursive) + Bodoni Moda (Serif) + Plus Jakarta Sans (Sans)', value: 2 },
        { label: 'Pack 3: Greating (Cursive) + EB Garamond (Serif) + Open Sans (Sans)', value: 3 },
        { label: 'Pack 4: Amsterdam Signature (Cursive) + Playfair Display (Serif) + Raleway (Sans)', value: 4 },
        { label: 'Pack 5: Halimunde Signature (Cursive) + Cinzel (Serif) + Outfit (Sans)', value: 5 },
    ])

    rl.close()

    console.log('\n===================================================================')
    console.log(' ⏳ CREANDO PROYECTO Y GENERANDO ARCHIVO DE CONFIGURACIÓN...')
    console.log('===================================================================\n')

    // Construcción de fecha objetivo ISO para la cuenta regresiva
    const [relHour = '17', relMinute = '00'] = religiousTime.replace(/[^0-9:]/g, '').split(':')
    const paddedHour = relHour.padStart(2, '0')
    const paddedMinute = relMinute.padStart(2, '0')
    const targetDateIso = `${religiousDate}T${paddedHour}:${paddedMinute}:00`

    const configManifest = {
        theme: {
            fontPack,
            palette,
            buttonVariant: 'primary',
            menu: {
                show: true,
                variant: 'bar',
                title: names,
                buttonVariant: 'icon',
            },
            music: {
                show: true,
                variant: 'floating',
                buttonVariant: 'primary',
                songTitle: 'Música de fondo',
                artistName: 'Música del evento',
            },
        },
        config: {
            hasTicketingSystem: false,
            hasRSVP: true,
            hasMusic: true,
            hasMenu: true,
        },
        sections: {
            hero: {
                showHero: true,
                names,
                subtitle: 'Nos complace invitarte a celebrar el día más importante de nuestras vidas',
                date: formatDateFormatted(religiousDate),
                bgImage: '',
            },
            message: {
                showMessage: true,
                message: 'Te invitamos de corazón a acompañarnos en este momento tan especial y celebrar juntos el amor que nos une.',
            },
            countdown: {
                showCountdown: true,
                targetDate: targetDateIso,
            },
            places: {
                showPlaces: true,
                locations: [
                    {
                        title: 'Ceremonia Religiosa',
                        location: religiousAddress,
                        time: religiousTime,
                        date: religiousDate,
                        url: religiousUrl,
                    },
                    {
                        title: 'Recepción & Fiesta',
                        location: partyAddress,
                        time: partyTime,
                        date: partyDate,
                        url: partyUrl,
                    },
                ],
            },
            itinerary: {
                showItinerary: true,
                itinerary: itineraryItems,
            },
            dressCode: {
                showDressCode: true,
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
                showGallery: true,
                title: 'Galería de Fotos',
                images: [],
            },
            presents: {
                showPresents: true,
                title: presentsTitle,
                url: presentsUrl,
            },
            confirmation: {
                showConfirmation: true,
            },
        },
    }

    // Copiar la estructura del template a la carpeta destino
    copyRecursive(TEMPLATE_ROOT, targetPath)

    // Escribir invitation.config.json en la carpeta destino
    const configPath = path.join(targetPath, 'invitation.config.json')
    fs.writeFileSync(configPath, JSON.stringify(configManifest, null, 2), 'utf-8')

    console.log('✅ Archivo invitation.config.json generado exitosamente.')

    // Sincronizar tokens SCSS
    try {
        console.log('🎨 Compilando tokens SCSS del tema en la nueva invitación...')
        execSync('node scripts/sync-theme.js', { cwd: targetPath, stdio: 'inherit' })
    } catch (e) {
        console.warn('⚠️ Nota: Recuerda ejecutar npm run theme:sync en la carpeta generada si es necesario.')
    }

    console.log('\n===================================================================')
    console.log(' 🎉 ¡PROYECTO DE INVITACIÓN CREADO Y CONFIGURADO CON ÉXITO! 🎉')
    console.log('===================================================================\n')
    console.log(`📌 Ubicación: ${targetPath}\n`)
    console.log('Para iniciar el proyecto ejecuta:\n')
    console.log(`   cd "${targetPath}"`)
    console.log('   npm install')
    console.log('   npm run dev\n')
}

main().catch(console.error)
