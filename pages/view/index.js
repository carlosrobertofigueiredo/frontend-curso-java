$(document).ready(myView)  //Chama a função myView

//Função principal da página 
function myView() {
    //Converte a String do sessionStorage em inteiro 
    const articleId = parseInt(sessionStorage.article)
    //IF testa a condição, se não for um número carrega e404   
    if (isNaN(articleId)) loadpage('e404')
    //a promise lê a api e concatena os artigos pegando o id e os artigos com status on.
    $.get(app.apiBaseURL + 'articles', { id: articleId, status: 'on' }) //se a promise for cumprida
        .done((data) => {
            //Se a resposta for diferente de 1, carrega a página e404
            if (data.length != 1) loadpage('e404')
            //Armazena os dados do primeiro artigo
            artData = data[0]
            //Define o título da página
            $('#artTitle').html(artData.title)
            //Lança o conteúdo dos artigos na página
            $('#artContent').html(artData.content)
            //Atualiza a quantidade de viewa
            updateViews(artData)
            //Altera o título da página do artigo
            changeTitle(artData.title)
            //Pega os dados do autor do artigo
            getAuthorData(artData)
            //Pega os artigos do autor
            getAuthorArticles(artData, 5)
            //Pega os comentários do formulário
            getUserCommentForm(artData)
            //Pega os comentários do artigo
            getArticleComments(artData, 999)
        })
        .fail((error) => {  // quando a promise não é cumprida entra no fail
            popUp({ type: 'error', text: 'Artigo não encontrado!' }) //carrega um popup de erro com o texto não encontrado
            loadpage('e404')  //carrega a página e404 na falha da solicitação
        })

}
//Os dados do autor do artigo
function getAuthorData(artData) {
    $.get(app.apiBaseURL + 'users/' + artData.author)
        .done((userData) => {

            var socialList = ''   //Lê os dados das redes sociais do autor e cria lista de links em uma nova página, caso exista.
            if (Object.keys(userData.social).length > 0) {
                socialList = '<ul class="social-list">'
                for (const social in userData.social) {
                    socialList += `<li><a href="${userData.social[social]}" target="_blank">${social}</a></li>`
                }
                socialList += '</ul>'
            }
            //Define os metadados do artigo com o nome do autor e a data formatada   
            $('#artMetadata').html(`<span>Por ${userData.name}</span><span>em ${myDate.sysToBr(artData.date)}.</span>`)
            //Define as informações do autor do artigo, incluindo nome, foto, idade e biografia.
            $('#artAuthor').html(`
                <img src="${userData.photo}" alt="${userData.name}">
                <h3>${userData.name}</h3>
                <h5>${getAge(userData.birth)} anos</h5>
                <p>${userData.bio}</p>
                ${socialList}
            `)
        })
        .fail((error) => { //será acionado se a solicitação não for bem sucedida
            console.error(error)  //exibe uma mensagem de erro no console do navegador
            loadpage('e404')
        })
}
//Função para pegar os artigos do autor
function getAuthorArticles(artData, limit) {

    $.get(app.apiBaseURL + 'articles', {  //$ é uma abreviação da jquery para usar o método get para a api e acessa os dados do artigo
        author: artData.author,  //autor
        status: 'on',   //artigos com o argumento on
        id_ne: artData.id,  // id do artigo
        _limit: limit  //quantidade de artigos do autor
    })   //Promise 
        .done((artsData) => {  //se a solicitação for bem sucedida executa o bloco do done
            if (artsData.length > 0) { //verifica se possui dados dentro de artsdata
                var output = '<h3><i class="fa-solid fa-plus fa-fw"></i> Artigos</h3><ul>' //cria uma string que será usada no html
                var rndData = artsData.sort(() => Math.random() - 0.5) // embaralha os artigos para aparecer aleatoriamente
                rndData.forEach((artItem) => {  //percorre cada elemento dentro do array de artigos
                    output += `<li class="art-item" data-id="${artItem.id}">${artItem.title}</li>` //adiciona o artigo a lista 
                });
                output += '</ul>'
                $('#authorArtcicles').html(output) //fecha a lista HTML <li>
            }
        })
        .fail((error) => {  //será acionado se a solicitação não for bem sucedida
            console.error(error)  //exibe uma mensagem de erro no console do navegador
            loadpage('e404')  //carrega a página e404 na falha da solicitação
        })

}
//Função para pegar os comentários nos artigos
function getArticleComments(artData, limit) { //$ é uma abreviação da jquery para usar o método get para a api e acessa os dados dos comentários no artigo

    var commentList = ''  // variável que armazena os comentários do artigo

    $.get(app.apiBaseURL + 'comments', {
        article: artData.id,
        status: 'on',
        _sort: 'date', // ordena pela data
        _order: 'desc', // data mais recente aparece no topo
        _limit: limit  //quantidade de comentários retornados
    })
        .done((cmtData) => {  //se a solicitação for bem sucedida executa o bloco do done
            if (cmtData.length > 0) {  //se houver algum comentário 
                cmtData.forEach((cmt) => { //é realizado um loop para cada comentário
                    var content = cmt.content.split("\n").join("<br>")  // e o conteúdo é limpo, Caso não haja comentários, é uma mensagem indicando que não há comentários em commentlist
                    /* os comentários serão armazenados na variável commentlist, a divcmtBox vai dividir cada comentário, a div cmtMetadata
                    vai receber a foto e informações do autot. a div cmtMetatexts vai receber as informações do autor em formato texto, os atributos entre a tag spam adiciona o nome do autor do comentário e a data 
                    como texto html. Esta linha adiciona o conteúdo do comentário em si à div cmtContent, utilizado a variável ${content}. */
                    commentList += `  
                        <div class="cmtBox">
                            <div class="cmtMetadata">
                                <img src="${cmt.photo}" alt="${cmt.name}" referrerpolicy="no-referrer">
                                <div class="cmtMetatexts">
                                    <span>Por ${cmt.name}</span><span>em ${myDate.sysToBr(cmt.date)}.</span>
                                </div>
                            </div>
                            <div class="cmtContent">${content}</div>
                        </div>
                    `
                })
            } else {
                commentList = '<p class="center">Nenhum comentário!<br>Seja o primeiro a comentar...</p>'  //Esta linha adiciona o HTML necessário para informar ao usuário que não há nenhum comentário.
            }
            $('#commentList').html(commentList)
        })
        .fail((error) => {  //será acionado se a solicitação não for bem sucedida
            console.error(error)  //exibe uma mensagem de erro no console do navegador
            loadpage('e404')  //carrega a página e404 na falha da solicitação
        })

}

function getUserCommentForm(artData) { // etorna um formulário de comentário HTML.

    var cmtForm = ''  //Cria uma variável vazia que será preenchida com o formulário de comentário.

    firebase.auth().onAuthStateChanged((user) => { //Verifica se há alguma mudança no estado da autenticação do usuário no Firebase.
        if (user) {  // Se houver um usuário autenticado, será exibido o formulário de comentário.

            /* A variável cmtForm será preenchida com o código HTML que forma o formulário de comentário.  
            $('#commentForm').html(cmtForm) - Insere o formulário de conteúdo na div com o id "commentForm".

            $('#formComment').submit((event) => { - Define o evento de envio do formulário de comentário para que ao ser clicado o botão de envio, a função sendComment seja acionada.

             sendComment(event, artData, user) - Chama a função sendComment e passa os parâmetros event, artData e user.
            
            */
            cmtForm = `
                <div class="cmtUser">Comentando como <em>${user.displayName}</em>:</div>
                <form method="post" id="formComment" name="formComment">
                    <textarea name="txtContent" id="txtContent">Comentário fake para testes</textarea>
                    <button type="submit">Enviar</button>
                </form>
            `
            $('#commentForm').html(cmtForm)
            $('#formComment').submit((event) => {
                sendComment(event, artData, user)
            })
        } else {   //Se não houver um usuário autenticado, será exibida uma mensagem pedindo para o usuário fazer login.
            cmtForm = `<p class="center"><a href="login">Logue-se</a> para comentar.</p>` //Define a mensagem de login para comentar na variávelcmtForm`.
            $('#commentForm').html(cmtForm)  //Insere a mensagem de login na div com o id "commentForm".
        }
    })

}

function sendComment(event, artData, userData) {  /* A função é usada para enviar comentários em artigos,
    event: recebe o objeto event para prevenir a ação padrão do formulário.
artData: recebe os dados do artigo em que o comentário será enviado.
userData: recebe os dados do usuário que está enviando o comentário. */

    event.preventDefault()  //método que previne a ação padrão do formulário.
    var content = stripHtml($('#txtContent').val().trim())  //recebe o valor do campo de conteúdo do comentário e remove qualquer marcação HTML.
    $('#txtContent').val(content)  //atualiza o campo de conteúdo do comentário com o valor sem marcação HTML.
    if (content == '') return false  //verifica se o campo de conteúdo do comentário está vazio e, se estiver, interrompe a execução da função.

    const today = new Date()  //armazena a data atual na constante today
    sysdate = today.toISOString().replace('T', ' ').split('.')[0] //armazena a data atual em formato ISO com a remoção do 'T' e dos milissegundos.

    $.get(app.apiBaseURL + 'comments', { //chama os comentários na api os dados do usuário, conteúdo do comentário e ID do artigo.
        uid: userData.uid,
        content: content,
        article: artData.id
    })
        .done((data) => { //se a solicitação for bem sucedida executa o bloco do done
            if (data.length > 0) {  //se o comentários for repetido exibe a mensagem abaixo para o usuário
                popUp({ type: 'error', text: 'Ooops! Este comentário já foi enviado antes...' })
                return false
            } else { //se o comentário não for repetido envia com as informações: nome, foto, email, id, artigo, conteúdo, data apenas nos On's.

                const formData = {
                    name: userData.displayName,
                    photo: userData.photoURL,
                    email: userData.email,
                    uid: userData.uid,
                    article: artData.id,
                    content: content,
                    date: sysdate,
                    status: 'on'
                }

                $.post(app.apiBaseURL + 'comments', formData) //os de formData para a api
                    .done((data) => { //se a solicitação for bem sucedida executa o bloco do done
                        if (data.id > 0) {
                            popUp({ type: 'success', text: 'Seu comentário foi enviado com sucesso!' }) //aviso de bem sucedido
                            loadpage('view') //carrega a view
                        }
                    })
                    .fail((err) => { //será acionado se a solicitação não for bem sucedida
                        console.error(err)  // exibe erro no console
                    })

            }
        })

}

function updateViews(artData) {  // Realiza uma requisição PATCH para a API, atualizando o campo "views" do artigo com o valor atualizado
    $.ajax({
        type: 'PATCH',  //o método patch atualiza o campo views do artigo, que corresponde o número de visualizações
        url: app.apiBaseURL + 'articles/' + artData.id, // A URL da requisição é construída concatenando a URL base da API (app.apiBaseURL) com o endpoint específico para atualização de um artigo (/articles/) e o ID do artigo que deve ser atualizado.
        data: { views: parseInt(artData.views) + 1 }  // a chave 'views' e o valor da visualização atualizada. O parseInt é utilizado para converter o valor de artData.views para um número inteiro e em seguida, o operador +1 é utilizado para adicionar mais uma visualização.
    });                                               //Sempre que a função updateViews é chamada, a API é atualizada com o número de visualizações incrementado.






}
