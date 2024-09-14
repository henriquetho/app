const { select, input, checkbox } = require('@inquirer/prompts')

let meta = {
    value: 'Tomar 3L de água por dia',
    checked: false,
}

let metas = [ meta ]

const cadatrarMeta = async () => {
    const meta = await input({ message: "Digitee sua meta:"})

    if(meta.length == 0) {
        console.log('A meta não pode ser vazia.')
        return
    }

    metas.push({ value: meta, checked: false })
}

const listarMetas = async () => {
    const respostas = await checkbox({
        message: "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o enter para finalizar essa etapa.",
        choices: [...metas],
        instructions: false
    })

    metas.forEach((m) => {
        m.checked = false
    })
    
    if(respostas.length == 0) {
        console.log("Nenhuma meta selecionada")
        return
    }

    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })

        meta.checked = true
    })

    console.log('Meta (s) marcadas como concluídas!')
}

const metasRealizadas = async () => {
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if(realizadas.length == 0) {
        console.log("Não há nenhuma meta realizada :(")
        return
    }

    await select({
        message: realizadas.length + " meta (s) realizadas",
        choices: [...realizadas]
    })
}

const metasabertas = async () => {
    const abertas = metas.filter((metas) => {
        return !metas.checked // mesma coisa que "retorn metas.checkd != true"
    })

    if(abertas.length == 0) {
        console.log("Não há nenhuma meta em aberto :)")
        return
    }

    await select({
        message: abertas.length + " meta (s) em aberto",
        choices: [...abertas]
    })
}

const start = async () => {
    
    while(true){

        const opcao = await select({
            message: "Menu >",
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "cadastrar"
                },
                {
                    name: "Listar metas",
                    value: "listar"
                },
                {
                    name: "Metas realizada",
                    value: "realizadas"
                },
                {
                    name: "Metas abertas",
                    value: "abertas"
                },
                {
                    name: "Sair",
                    value: "sair"
                }
            ] 
        })

        switch(opcao) {
            case "cadastrar":
                await cadatrarMeta()
                console.log(metas)
                break
            case "listar":
                await listarMetas()
                break
            case "realizadas":
                await metasRealizadas()
                case "abertas":
                    await metasabertas()
            case "sair":
                return
        }
    }
}

start()
