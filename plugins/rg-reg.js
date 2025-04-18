import { createHash } from 'crypto'

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i
let handler = async function (m, { conn, text, usedPrefix, command }) {
    let user = global.db.data.users[m.sender]
    let name2 = conn.getName(m.sender)
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? this.user.jid : m.sender
    let pp = await this.profilePictureUrl(who, 'image').catch(_ => 'https://ibb.co/3yJNbqZ5')

    if (user.registered === true) throw `*⚠️ Ya estás registrado*\n\n¿Quiere volver a registrarse?\n\n💬 Use este comando para *eliminar su registro*\n*${usedPrefix}unreg* <Número de serie>`
    if (!Reg.test(text)) throw `*⚠️ Formato incorrecto*\n\n📝 Uso del comando: *${usedPrefix + command} nombre.edad*\n💡 Ejemplo : *${usedPrefix + command}* ${name2}.18`

    let [_, name, splitter, age] = text.match(Reg)
    if (!name) throw '*📝 El nombre no puede estar vacío*'
    if (!age) throw '*📝 La edad no puede estar vacía*'
    if (name.length >= 30) throw '*⚠️ El nombre es demasiado largo*'
    age = parseInt(age)
    if (age > 100) throw '*👴🏻 Wow el abuelo quiere jugar al bot*'
    if (age < 5) throw '*👀 hay un bebé jsjsj*'

    user.name = name.trim()
    user.age = age
    user.regTime = + new Date
    user.registered = true

    // Agrega 10 dulces al registro en la base de datos "limit"
    if (!user.limit) user.limit = 0; // Asegurarse de que exista la propiedad
    user.limit += 10; // Sumar 10 dulces

    let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 6)
    m.react('📩')

    let regbot = `🗃️ *R E G I S T R A D O* 🗃️\n
💌 *Nombre:* ${name}
📆 *Edad* : ${age} años
🍬 *Dulces añadidos:* 10`

    await conn.sendMessage(m.chat, {
        image: { url: pp },
        caption: regbot
    }, { quoted: m })
}

handler.help = ['reg']
handler.tags = ['rg']
handler.command = ['verify', 'reg', 'verificar']

export default handler
