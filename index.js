const { select, input, checkbox } = require('@inquirer/prompts')
const fs = require("fs").promises
let mensagem = "Bem vindo ao App de Metas"

let metas 

const carregarMetas = async () => {
    try {
        const dados = await fs.readFile("metas.json", "utf-8")
        metas = JSON.parse(dados)
    }
    catch {
        metas = []
    }
}

const cadatrarMeta = async () => {
    const meta = await input({ message: "Digite sua meta:"})

    if(meta.length == 0) {
        mensagem = 'A meta não pode ser vazia.'
        return
    }

    metas.push({ value: meta, checked: false })

    mensagem = "Meta cadastrada com sucesso!"
}

const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}

const listarMetas = async () => {
    if(metas.length == 0) {
        mensagem = "Não exitem metam"
        return
    }

    const respostas = await checkbox({
        message: "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o enter para finalizar essa etapa.",
        choices: [...metas],
        instructions: false
    })

    metas.forEach((m) => {
        m.checked = false
    })
    
    if(respostas.length == 0) {
        mensagem = "Nenhuma meta selecionada"
        return
    }

    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })

        meta.checked = true
    })

    mensagem = 'Meta (s) marcadas como concluídas!'
}

const metasRealizadas = async () => {
    if(metas.length == 0) {
        mensagem = "Não exitem metam"
        return
    }

    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if(realizadas.length == 0) {
        mensagem = "Não há nenhuma meta realizada :("
        return
    }

    await select({
        message: realizadas.length + " meta (s) realizadas",
        choices: [...realizadas]
    })
}

const metasAbertas = async () => {
    if(metas.length == 0) {
        mensagem = "Não exitem metam"
        return
    }

    const abertas = metas.filter((metas) => {
        return !metas.checked // mesma coisa que "retorn metas.checkd != true"
    })

    if(abertas.length == 0) {
        mensagem = "Não há nenhuma meta em aberto :)"
        return
    }

    await select({
        message: abertas.length + " meta (s) em aberto",
        choices: [...abertas]
    })
}

const deletarMetas = async () => {
    if(metas.length == 0) {
        mensagem = "Não exitem metam"
        return
    }
    
    const metasDesmarcadas = metas.map((meta) => {
        return { value: meta.value, checked: false}
    })

    const itemsADeletar = await checkbox({
        message: "Selecione item para remover.",
        choices: [...metasDesmarcadas],
        instructions: false
    })

    if(itemsADeletar.length == 0 ) {
        mensagem = "Nenhuma item para deletar!"
        return
    }

    itemsADeletar.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item
        })
    })

    mensagem = "Meta(s) deletada(s) com sucesso!"
}

const mostrarMensagem = () => {
    console.clear()

    if(mensagem != "") {
        console.log(mensagem)
        console.log("")
        mensagem = ""
    }
}

const start = async () => {

    await carregarMetas()

    while(true){
        mostrarMensagem()
        await salvarMetas()

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
                    name: "Deletar metas",
                    value: "deletar"
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
                break
            case "listar":
                await listarMetas()
                break
            case "realizadas":
                await metasRealizadas()
                break
            case "abertas":
                await metasAbertas()
                break
            case "deletar":
                await deletarMetas()
                break
            case "sair":
                console.log("Até mais :)")
                return
        }
    }
}

start()
